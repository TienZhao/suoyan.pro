import { ClientConfig } from "tencentcloud-sdk-nodejs/tencentcloud/common/interface";
import { Client as NlpClient} from "tencentcloud-sdk-nodejs/tencentcloud/services/nlp/v20190408/nlp_client"
import { Client as TmtClient} from "tencentcloud-sdk-nodejs/tencentcloud/services/tmt/v20180321/tmt_client"
import * as tencentcloud from "tencentcloud-sdk-nodejs"


export const createClient = async (config: ClientConfig) => {
    const nlpClient: NlpClient = new tencentcloud.nlp.v20190408.Client(config)
    return nlpClient
}


export const createTmtClient = async (config: ClientConfig) => {
    const tmtClient: TmtClient = new tencentcloud.tmt.v20180321.Client(config)
    return tmtClient
}