import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Neo4jService } from 'libs/neo4j/src/neo4j.service';
import { Neo4jSentenceTranslationRequest, Neo4jCreateSentenceRequest, Neo4jCreateTranslationRequest, Neo4jCreateSimilarityRequest, Neo4jSentenceSimilarityRequest } from 'libs/neo4j/src/neo4j.model';
import { SbdService } from 'libs/sbd/src/sbd.service';
import { TencentcloudService } from 'libs/tencentcloud/src/tencentcloud.service'
import { LexicalAnalysisRequest, Similarity, TextSimilarityRequest } from 'tencentcloud-sdk-nodejs/tencentcloud/services/nlp/v20190408/nlp_models'
import { TextTranslateRequest, LanguageDetectRequest } from 'tencentcloud-sdk-nodejs/tencentcloud/services/tmt/v20180321/tmt_models';
import { AlignRequest, Article, Relation, AlignLanguage} from './align.model';
import { SbdRequest } from 'libs/sbd/src/sbd-config.interface';
import { ALIGN_RESPONSE } from './align.test'

@Injectable()
export class AlignService {

  constructor(private readonly neo4jService: Neo4jService,
    private readonly tencentcloudService: TencentcloudService,
    private readonly sbdService: SbdService
    ) {}
  
  alignArticlesTest(){
    return ALIGN_RESPONSE
  }

  async alignArticles(alignReq: AlignRequest) {
    // Step 0: Detect the language of article inputs.
    // Laguage Detect is based on tencentcloudService.
    // Document: https://cloud.tencent.com/document/api/551/15620
    // Pricing: Free of charge, according to Tencentcloud service chat.
    for (var i = 0; i < alignReq.articles.length; i++ ){
      const ldReq: LanguageDetectRequest = {
        Text: alignReq.articles[i].text,
        ProjectId: 0,
      };
      const ldRes = await this.tencentcloudService.languageDetect(ldReq);
      if(alignReq.articles[i].lang == 'auto'){
        // If input language parameter is 'auto', give it a decent language code.
        alignReq.articles[i].lang = ldRes.Lang as AlignLanguage;
      } else {
        // Otherwise, determine if the input language parameter is correct.
        if(ldRes.Lang != alignReq.articles[i].lang){
          // Throw an error when incorrect.
          console.log(`Input language of article ${i} seems incorrect!`)
          throw new HttpException(`Input language of article ${i} seems incorrect! For safety reasons, Yanyes (alpha) blocks any request with a language parameter different from the language detection result of the text.`, HttpStatus.BAD_REQUEST);
        }
      }
    }

    // Step 1: Split article into sentences with sbd modle.
    // sbdService is a local service, thus the cost of call is virtually zero.
    var newArticles = [];
    for (var i = 0; i < alignReq.articles.length; i++ ){
      const sbdReq: SbdRequest = {  
        text: alignReq.articles[i].text,
        lang: alignReq.articles[i].lang,
      };
      const sbdRes = this.sbdService.splitSentence([sbdReq])[0]
      sbdRes.sentenceArray.forEach(sentence =>{
        this.neo4jService.neo4jCreateSentenceNode({ // Create node if it doesn't exist.
          text: sentence,
          lang: sbdRes.lang,
          gene: 'human'
        })
      })
      newArticles.push(sbdRes);
    }
    alignReq.articles = newArticles;

    // Step 2: Translate one article into Chinese and split into sentences.
    // Text Translate is based on tencentcloudService.
    // Document: https://cloud.tencent.com/document/product/551/15619
    // Pricing: 5 million character every month for free; 58 CNY per million character after the free quota.
    // Translation history is stored in Neo4j database, which can be used for future requests.
    for (var i = 0; i < alignReq.articles.length; i++ ){
      if (alignReq.articles[i].lang == 'zh'){
        continue;
      } else {
        alignReq.articles[i].translLang = 'zh';
        alignReq.articles[i] = await this.articleTranslate(alignReq.articles[i]);
        // console.log(alignReq.articles[i]);
        break;
      }        
    }

    // Step 3: Calculate the similarity between the sentences of the translation-relayed article and those of the direct-sent article.
    // Text Translate is based on tencentcloudService.
    // Document: https://cloud.tencent.com/document/product/271/35506
    // Pricing 500,000 free calls every day; 27 CNY per 10,000 call after the free quota.
    // Similarity-calculation history is stored in Neo4j database, which can be used for future requests.
    var directArticleIndex: number
    var relayedArticleIndex: number
    var relationArray: Relation[] = []
    for (var i = 0; i < alignReq.articles.length; i++ ){
      if (alignReq.articles[i].lang == 'zh'){
        directArticleIndex = i;
        continue;
      } else {
        relayedArticleIndex = i;
        break;
      }
    }
    let relayedArticleSentences = alignReq.articles[relayedArticleIndex].translSentenceArray;
    let directArticleSentences = alignReq.articles[directArticleIndex].sentenceArray;
    let directArticleLength = directArticleSentences.length;
    // Define constants based on experience.
    // E.g. When relayed[2] is aligned with direct[2], 
    // relayed[3] is to be compared with direct[1,2] (as difined by LOOKBACK),
    // and direct[3,4,5] (as difined by LOOKFORWARD)
    const LOOKBACK = 2;
    const LOOKFORWARD = 3;
    var lastHitIndex = -1; 
    // lastHitIndex is the index of the direct[] sentence that 'aligns' with last relayed[] sentence.
    // 'Align' refers to the one with a similarity score highest in the selection or over the threshold.
    // If there are multiple 'aligned' sentences, then choose the one with the largest index.
    var lastHitScore = 0;
    const HITSCORETHRESHOLD = 0.7;
    for (var i = 0; i < relayedArticleSentences.length; i ++){
      var lastHitScore = 0;
      var selectionStartIndex = (lastHitIndex + 1 - LOOKBACK); 
      if (selectionStartIndex < 0){selectionStartIndex = 0;}
      var selectionEndIndex = lastHitIndex + 1 + LOOKFORWARD;
      if (selectionEndIndex > directArticleLength){selectionEndIndex = directArticleLength;}
      const similarityReq: TextSimilarityRequest = {
        SrcText: relayedArticleSentences[i],
        TargetText: directArticleSentences.slice(selectionStartIndex,selectionEndIndex)
      };
      const similarityRes = await this.textSimilarity(similarityReq);

      for (var j = 0; j < similarityRes.Similarity.length; j ++){
        // Parse similarity analysis response
        let sim = similarityRes.Similarity[j]          
        const newRelation: Relation = {
          nodes: [{
            articleIndex: relayedArticleIndex,
            sentenceIndex: i,
            text: similarityReq.SrcText,
            lang: alignReq.articles[relayedArticleIndex].lang
          }, {
            articleIndex: directArticleIndex,
            sentenceIndex: selectionStartIndex + j,
            text: sim.Text,
            lang: 'zh'
          }],
          similarity: sim.Score,
          method: 'tmt-relay'
        }
        relationArray.push(newRelation)
        // Decide lastHitIndex
        if(sim.Score > lastHitScore || sim.Score >= HITSCORETHRESHOLD){
          lastHitScore = sim.Score;
          lastHitIndex = selectionStartIndex + j;
        }
      }
    }
    alignReq.relations = relationArray
    console.log(alignReq)
    return alignReq
  }

  // <-- Functions for alignArticles - STEP #1: sentence boundary detection -->

  // Sentence boundary detection for multiple languages
  sbd(body: SbdRequest){
    const result = this.sbdService.splitSentence([body]);
    // console.log(result);
    return result
  }

  // <-- Functions for alignArticles - STEP #2: Translation -->

  async articleTranslate(article: Article){
    // Step T1: Try to translate all sentences by searching in Neo4j.
    var translatedSentenceArray = []
    var toBeTranslatedSentenceArray = []
    for (var i = 0; i < article.sentenceArray.length; i++){    
      const req: Neo4jSentenceTranslationRequest = {
        srcText: article.sentenceArray[i],
        srcLang: article.lang,
        tgtLang: article.translLang,
      }
      var res = await this.neo4jService.neo4jSentenceTranslation(req); // Return '' when no result.
      if (res == ''){
        toBeTranslatedSentenceArray[i] = req.srcText;
      } else {
        translatedSentenceArray[i] = res;
      }
    }
    // Step T2: Translate rest of the sentences by online API (Tencent cloud).
    if (toBeTranslatedSentenceArray.length > 0){
      const onlineTranslateReq: TextTranslateRequest = {
        SourceText: toBeTranslatedSentenceArray.join('\n'),
        Source: article.lang,
        Target: 'zh',
        ProjectId: 0
      };
      const onlineTraslateRes = await this.tencentTextTranslate(onlineTranslateReq);
      const onlineTraslatedSentenceArray = onlineTraslateRes.TargetText.split('\n');
      // Merge with previous translation results and save in translatedSentenceArray.
      for (var i = 0; i < article.sentenceArray.length; i++){
        if (translatedSentenceArray[i] === undefined){
          translatedSentenceArray[i] = onlineTraslatedSentenceArray[i];
        }
      }
    }    
    article.translSentenceArray = translatedSentenceArray;
    article.translSentenceLineBreak = translatedSentenceArray.join('\n');
    return article
  }

  async tencentTextTranslate(req: TextTranslateRequest) {
    // Text translation with Tencent Cloud Service
    // TO-DO： Split the request text and make requests with less than 2000 characters each.
    if (req.SourceText.length > 2000){
      req.SourceText = req.SourceText.substr(2000)
    }
    // console.log(req);
    const result = await this.tencentcloudService.textTranslate(req);
    // Save translation records to database;
    const srcSentenceArray = req.SourceText.split('\n');
    const resSentenceArray = result.TargetText.split('\n');
    for (var i = 0; i < srcSentenceArray.length; i++){
      if (srcSentenceArray[i] != '' && resSentenceArray[i] != ''){
        const neo4jReq: Neo4jCreateTranslationRequest = {
          srcSentence: srcSentenceArray[i],
          srcLang: req.Source,
          tgtSentence: resSentenceArray[i],
          tgtLang: req.Target,
          gene: 'machine',
          provider: 'tencent',
        }
        this.neo4jService.neo4jCreateTranslation(neo4jReq);
      }
    }
    return result
  }

  // <-- Functions for alignArticles - STEP #3: Similarity Calculation -->

  // Determine text similarity between source sentence and target sentence array.
  // Using this.neo4jSentenceSimilarity and this.tencentcloudService.textSimilarity
  async textSimilarity(req: TextSimilarityRequest) {
    var similarityArrayTBD = JSON.parse(JSON.stringify(req.TargetText));  // Similarity scores to be determined.
    var similarityArrayTBS = []; // Similarity scores determined, but to be sorted.
    var similarityArraySorted = [];
    // Step S1: Search existing similarity relation in the database
    for(i = 0; i < similarityArrayTBD.length; i++){
      const score = await this.neo4jService.neo4jSentenceSimilarity({ // Return 0 when there is no result.
        srcSentence: req.SrcText,
        tgtSentence: similarityArrayTBD[i],
      })
      if (score > 0){ // When there is similarity result of the 2 input sentences.
        var similarity: Similarity = {
          Score: score,
          Text: similarityArrayTBD[i],
        };
        similarityArrayTBD.splice(i, 1); // Remove the corresponding sentence from TBD array.
        similarityArrayTBS.push(similarity); // Add similarity score to TBS array.
      }
    }
    // Step S2: Determine the score of the remaining sentence pairs by calling online API.
    var newReq: TextSimilarityRequest = {
      SrcText: req.SrcText,
      TargetText: similarityArrayTBD,
    }
    var response = await this.tencentcloudService.textSimilarity(newReq);  // This array is sorted by similarity score, from high to low. 
    similarityArrayTBS.push.apply(similarityArrayTBS, response.Similarity); // Merge arrays.
    // Step S3: Re-sort 'response' by the order in req.TargetText.
    for(var i = 0; i < req.TargetText.length; i++){
      for(var j = 0; j < similarityArrayTBS.length; j++){
        if(req.TargetText[i] == similarityArrayTBS[j].Text){
          similarityArraySorted.push(similarityArrayTBS[j]);
          break;
        }
      }
    }
    response.Similarity = similarityArraySorted;
    // Save similarity relations to Neo4j
    similarityArraySorted.forEach(similarity =>{
      this.neo4jService.neo4jCreateSimilarity({
        srcSentence: req.SrcText,
        tgtSentence: similarity.Text,
        score: similarity.Score,
        provider: 'tencent'
      });
    })
    return response
  }
  
  // <-- Test Functions - Not Used -->

  // Lexical Analysis (Test Function)
  async lexicalAnalysis(body) {
    // console.log(body);
    const text = body.text;
    const result = await this.tencentcloudService.lexicalAnalysis(text);
    return result
  }
}
