import { Injectable, Inject } from '@nestjs/common';
import { TENCENTCLOUD_CONFIG, TENCENTCLOUD_CLIENT, TENCENTCLOUD_TMT_CLIENT } from './tencentcloud-contants'
import { ClientConfig } from "tencentcloud-sdk-nodejs/tencentcloud/common/interface";
import { Client as NlpClient} from "tencentcloud-sdk-nodejs/tencentcloud/services/nlp/v20190408/nlp_client"
import { Client as TmtClient} from "tencentcloud-sdk-nodejs/tencentcloud/services/tmt/v20180321/tmt_client"
import { LexicalAnalysisRequest, TextSimilarityRequest } from 'tencentcloud-sdk-nodejs/tencentcloud/services/nlp/v20190408/nlp_models'
import { LanguageDetectRequest, TextTranslateRequest } from 'tencentcloud-sdk-nodejs/tencentcloud/services/tmt/v20180321/tmt_models';


@Injectable()
export class TencentcloudService {

    constructor(
        @Inject(TENCENTCLOUD_CONFIG) private readonly config: ClientConfig,
        @Inject(TENCENTCLOUD_CLIENT) private readonly nlpClient: NlpClient,
        @Inject(TENCENTCLOUD_TMT_CLIENT) private readonly tmtClient: TmtClient,
    ){}

    getNlpClient(): NlpClient{
        return this.nlpClient
    }

    getTmtClient(): TmtClient{
        return this.tmtClient
    }

    getConfig(): ClientConfig{
        return this.config
    }

    
    async lexicalAnalysis(req: LexicalAnalysisRequest){
        const res = await this.nlpClient.LexicalAnalysis(req)
        // console.log(res)
        return res
    }

    async textSimilarity(req: TextSimilarityRequest ){
        const res = await this.nlpClient.TextSimilarity(req)
        return res
    }

    async textTranslate(req: TextTranslateRequest){
        const res = await this.tmtClient.TextTranslate(req)
        return res
    }

    async languageDetect(req: LanguageDetectRequest){
        const res = await this.tmtClient.LanguageDetect(req)
        return res
    }

}
