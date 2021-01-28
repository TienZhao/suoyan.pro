import { DynamicModule, Module } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';
import { NEO4J_CONFIG, NEO4J_DRIVER } from './neo4j-contants';
import { Neo4jConfig } from './neo4j-config.interface';
import { createDriver } from './neo4j.util';


// @Module({
//   providers: [Neo4jService],
//   exports: [Neo4jService],
// })
// export class Neo4jModule {}

@Module({})
export class Neo4jModule {

  static forRoot(config: Neo4jConfig): DynamicModule{
    return{
      module: Neo4jModule,
      providers: [
        Neo4jService,
        {
          provide: NEO4J_CONFIG,
          useValue: config,
        },
        {
          provide: NEO4J_DRIVER,
          inject: [ NEO4J_CONFIG],
          useFactory: async (config: Neo4jConfig) => createDriver(config),
        }
      ],
      exports: [
        Neo4jService,
      ]
    }
  }

}
