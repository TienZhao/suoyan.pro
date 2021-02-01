import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'libs/neo4j/src/neo4j.service';
import { SbdService } from 'libs/sbd/src/sbd.service';
import { TencentcloudService } from 'libs/tencentcloud/src/tencentcloud.service'

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

  async lexicalAnalysis(body) {
    // console.log(body);
    const text = body.text;
    const result = await this.tencentcloudService.lexicalAnalysis(text);
    return result
  }

  // sbd stands for sentence boundary detection
  sbd(body){
    const result = this.sbdService.splitSentence(body);
    // console.log(result);
    return result
  }
}
