import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Neo4jModule } from 'libs/neo4j/src/neo4j.module';


// @Module({
//   imports: [],
//   controllers: [AdminController],
//   providers: [AdminService],
// })
// export class AdminModule {}


@Module({
  imports: [
    Neo4jModule.forRoot({
      scheme: 'neo4j',
      host: 'localhost',
      port: 7687,
      username: 'neo4j',
      password: 'FengTuRenQ!ng',
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
