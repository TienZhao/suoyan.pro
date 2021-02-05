import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'libs/neo4j/src/neo4j.service';
import { SbdService } from 'libs/sbd/src/sbd.service';
import { TencentcloudService } from 'libs/tencentcloud/src/tencentcloud.service'
import { LexicalAnalysisRequest, Similarity, TextSimilarityRequest } from 'tencentcloud-sdk-nodejs/tencentcloud/services/nlp/v20190408/nlp_models'
import { TextTranslateRequest } from 'tencentcloud-sdk-nodejs/tencentcloud/services/tmt/v20180321/tmt_models';
import { AlignRequest, Article, Relation } from './align.model';
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

    // console.log(alignReq)
    // Step 1: Split article into sentences with sbd modle
    var newArticles = [];
    for (var i = 0; i < alignReq.articles.length; i++ ){
      const sbdReq: SbdRequest = {  
        text: alignReq.articles[i].text,
        lang: alignReq.articles[i].lang,
      };
      newArticles.push(this.sbdService.splitSentence([sbdReq])[0]);
    }
    alignReq.articles = newArticles;

    // Step 2: Translate one article into Chinese and split into sentences
    for (var i = 0; i < alignReq.articles.length; i++ ){
      if (alignReq.articles[i].lang == 'zh'){
        continue;
      } else {
        const translateReq: TextTranslateRequest = {
          SourceText: alignReq.articles[i].sentenceLineBreak,
          Source: alignReq.articles[i].lang,
          Target: 'zh',
          ProjectId: 0
        }
        const traslateRes = this.textTranslaste(translateReq);
        alignReq.articles[i].sentenceTranslatedLineBreak = (await traslateRes).TargetText
        alignReq.articles[i].sentenceTranslatedArray = (await traslateRes).TargetText.split('\n')
        break;
      }        
    }

    // Step 3: Calculate the similarity between the sentences of the translation-relayed article 
    // and those of the direct-sent article.
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
    let relayedArticleSentences = alignReq.articles[relayedArticleIndex].sentenceTranslatedArray;
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


  // Sentence boundary detection
  sbd(body: SbdRequest){
    const result = this.sbdService.splitSentence([body]);
    // console.log(result);
    return result
  }

  async lexicalAnalysis(body) {
    // console.log(body);
    const text = body.text;
    const result = await this.tencentcloudService.lexicalAnalysis(text);
    return result
  }

  async textSimilarity(req: TextSimilarityRequest) {
    // console.log(req);
    var response = await this.tencentcloudService.textSimilarity(req);
    // this.tencentcloudService.textSimilarity() gives an response array
    // sorted by similarity score, from high to low. 
    // The response is re-sorted by the order in req.TargetText.
    var similarityArray = [];
    for(var i = 0; i < req.TargetText.length; i++){
      var similarity: Similarity = {
        Score: 0,
        Text: req.TargetText[i],
      };
      for(var j = 0; j < response.Similarity.length; j++){
        if(req.TargetText[i] == response.Similarity[j].Text){
          similarity.Score = response.Similarity[j].Score;
          break;
        }
      }
      similarityArray.push(similarity);
    }
    response.Similarity = similarityArray;
    console.log(response)
    return response
  }

  async textTranslaste(req: TextTranslateRequest) {
    if (req.SourceText.length > 2000){
      req.SourceText = req.SourceText.substr(2000)
    }
    // console.log(req);
    const result = await this.tencentcloudService.textTranslate(req);
    return result
  }





  async getHello(): Promise<string> {
    const result = this.neo4jService.read('MATCH (n) RETURN count(n) AS COUNT', {});
    const count = (await result).records[0].get('COUNT')
    // console.log(`Hello Neo4j User! There are ${count} nodes in the database`)
    return `Hello Neo4j User! There are ${count} nodes in the database`;
  }

  async postHello(): Promise<string> {
    const timestamp = Date.parse(new Date().toString())
    const cypherSentence = "CREATE (Hello:Movie {timestamp:'" + timestamp + "', user:'admin'})"
    const result = this.neo4jService.write(cypherSentence, {});    
    const res = await result
    // console.log(`Hello Neo4j User! There are ${count} nodes in the database`)
    return `${res}`;
  }
}
