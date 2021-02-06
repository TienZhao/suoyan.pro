import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Neo4jModule } from 'libs/neo4j/src/neo4j.module';
import { TencentcloudModule } from 'libs/tencentcloud/src/tencentcloud.module';
import { SbdModule } from 'libs/sbd/src/sbd.module';
import { XlsxModule } from '../../../libs/xlsx/src/xlsx.module';
import { Neo4jCredential, TencentcloudCredential} from './admin.credentials'
import { AlignModule } from './align/align.module';
import { AlignService } from './align/align.service';

@Module({
  imports: [
    AlignModule,
    XlsxModule,
    SbdModule,
    // The type of Neo4jCredential is defined at 'libs/neo4j/src/neo4j-config.interface'
    Neo4jModule.forRoot(Neo4jCredential),    
    // The type of TencentcloudCredential is defined at "tencentcloud-sdk-nodejs/tencentcloud/common/interface"
    TencentcloudModule.forRoot(TencentcloudCredential)
  ],
  controllers: [AdminController],
  providers: [AdminService, AlignService],
})
export class AdminModule {}

