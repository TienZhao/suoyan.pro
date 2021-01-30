import { DynamicModule, Module } from '@nestjs/common';
import { TencentcloudService } from './tencentcloud.service';
import { ClientConfig } from "../../../node_modules/tencentcloud-sdk-nodejs/tencentcloud/common/interface";
import { TENCENTCLOUD_CONFIG, TENCENTCLOUD_CLIENT } from './tencentcloud-contants'
import { createClient } from './tencentcloud.util';


@Module({
  providers: [TencentcloudService],
  exports: [TencentcloudService],
})
export class TencentcloudModule {
  static forRoot(config: ClientConfig): DynamicModule{
    return{
      module: TencentcloudModule,
      providers: [
        TencentcloudService,
        {
          provide: TENCENTCLOUD_CONFIG,
          useValue: config,
        },
        {
          provide: TENCENTCLOUD_CLIENT,
          inject: [ TENCENTCLOUD_CONFIG ],
          useFactory: async (config: ClientConfig) => createClient(config),
        }
      ],
      exports: [
        TencentcloudService,
      ]
    }
  }}
