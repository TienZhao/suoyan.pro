import { Injectable, Inject } from '@nestjs/common';
import { TENCENTCLOUD_CONFIG, TENCENTCLOUD_CLIENT } from './tencentcloud-contants'
import { ClientConfig } from "tencentcloud-sdk-nodejs/tencentcloud/common/interface";
import { Client } from "tencentcloud-sdk-nodejs/tencentcloud/services/nlp/v20190408/nlp_client";
import { LexicalAnalysisRequest, LexicalAnalysisResponse, TextSimilarityRequest } from 'tencentcloud-sdk-nodejs/tencentcloud/services/nlp/v20190408/nlp_models'
import * as tencentcloud from "tencentcloud-sdk-nodejs";


@Injectable()
export class TencentcloudService {

    constructor(
        @Inject(TENCENTCLOUD_CONFIG) private readonly config: ClientConfig,
        @Inject(TENCENTCLOUD_CLIENT) private readonly client: Client
    ){}

    getClient(): Client{
        return this.client
    }

    getConfig(): ClientConfig{
        return this.config
    }

    
    async lexicalAnalysis(text: string){
        const req: LexicalAnalysisRequest = {
            Text: text,
            /*待分析的文本（仅支持UTF-8格式，不超过500字），需要做检验 */
            // DictId: '1',
            /* DictId 词法分析模式（可选，默认取2值）：1、高精度（混合粒度分词能力）；2、高性能（单粒度分词能力）；              */
        }

        // 通过client对象调用想要访问的接口，需要传入请求对象以及响应回调函数
        const res = await this.client.LexicalAnalysis(req)
        // console.log(res)
        return res
    }

    async textSimilarity(req: TextSimilarityRequest ){
        const res = await this.client.TextSimilarity(req)
        return res
    }

}
