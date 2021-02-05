import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'libs/neo4j/src/neo4j.service';
import { SbdService } from 'libs/sbd/src/sbd.service';
import { TencentcloudService } from 'libs/tencentcloud/src/tencentcloud.service'
import { LexicalAnalysisRequest, TextSimilarityRequest } from 'tencentcloud-sdk-nodejs/tencentcloud/services/nlp/v20190408/nlp_models'
import { TextTranslateRequest } from 'tencentcloud-sdk-nodejs/tencentcloud/services/tmt/v20180321/tmt_models';

// @Injectable()
// export class AdminService {
//   getHello(): string {
//     return 'Hello World!';
//   }
// }


@Injectable()
export class AdminService {

  constructor(private readonly neo4jService: Neo4jService,
    private readonly tencentcloudService: TencentcloudService,
    private readonly sbdService: SbdService
    ) {}

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

  async lexicalAnalysis(req: LexicalAnalysisRequest) {
    // console.log(body);
    const result = await this.tencentcloudService.lexicalAnalysis(req);
    return result
  }

  async textSimilarity(req: TextSimilarityRequest) {
    // console.log(req);
    const result = await this.tencentcloudService.textSimilarity(req);
    return result
  }

  async textTranslaste(req: TextTranslateRequest) {
    console.log(req);
    console.log(this.tencentcloudService.getTmtClient())
    const result = await this.tencentcloudService.textTranslate(req);
    return result
  }

  // sbd stands for sentence boundary detection
  sbd(body){
    const result = this.sbdService.splitSentence(body);
    // console.log(result);
    return result
  }
}
