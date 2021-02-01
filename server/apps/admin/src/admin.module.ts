import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Neo4jModule } from 'libs/neo4j/src/neo4j.module';
import { TencentcloudModule } from 'libs/tencentcloud/src/tencentcloud.module';
import { SbdModule } from 'libs/sbd/src/sbd.module';


// @Module({
//   imports: [],
//   controllers: [AdminController],
//   providers: [AdminService],
// })
// export class AdminModule {}


@Module({
  imports: [
    SbdModule,
    Neo4jModule.forRoot({
      scheme: 'bolt',
      host: 'localhost',
      port: 7687,
      username: 'neo4j',
      password: 'FengTu',
    }),
    TencentcloudModule.forRoot({
      credential: {
        secretId: "", //
        secretKey: "", //
      },
      region: "ap-guangzhou", // NLP只支持ap-guangzhou，否则报错The action not support this region.

      profile: {
        signMethod: "HmacSHA256", // 签名方法
        httpProfile: {
          reqMethod: "POST", // 请求方法
          reqTimeout: 30, // 请求超时时间，默认60s
        },
      },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
