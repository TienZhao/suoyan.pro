import { Module } from '@nestjs/common';
import { Neo4jModule } from 'libs/neo4j/src/neo4j.module';
import { TencentcloudModule } from 'libs/tencentcloud/src/tencentcloud.module';
import { SbdModule } from 'libs/sbd/src/sbd.module';
import { Neo4jCredential, TencentcloudCredential} from '../admin.credentials'
import { AlignService } from './align.service';


@Module({
  imports: [
    SbdModule,
    // The type of Neo4jCredential is defined at 'libs/neo4j/src/neo4j-config.interface'
    Neo4jModule.forRoot(Neo4jCredential),    
    // The type of TencentcloudCredential is defined at "tencentcloud-sdk-nodejs/tencentcloud/common/interface"
    TencentcloudModule.forRoot(TencentcloudCredential)
  ],
  providers: [AlignService],
})
export class AlignModule {}

