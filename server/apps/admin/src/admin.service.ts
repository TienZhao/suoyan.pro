import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'libs/neo4j/src/neo4j.service';

// @Injectable()
// export class AdminService {
//   getHello(): string {
//     return 'Hello World!';
//   }
// }


@Injectable()
export class AdminService {

  constructor(private readonly neo4jService: Neo4jService) {}

  async getHello(): Promise<string> {
    const result = this.neo4jService.read('MATCH (n) RETURN count(n) AS COUNT', {});
    const count = (await result).records[0].get('COUNT')

    // console.log(this.neo4jService)
    return `Hello Neo4j User! There are ${count} nodes in the database`;
  }
}
