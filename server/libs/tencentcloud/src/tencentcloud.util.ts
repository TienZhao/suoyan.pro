import { ClientConfig } from "tencentcloud-sdk-nodejs/tencentcloud/common/interface";
import { Client } from "tencentcloud-sdk-nodejs/tencentcloud/services/nlp/v20190408/nlp_client";
import * as tencentcloud from "tencentcloud-sdk-nodejs"


export const createClient = async (config: ClientConfig) => {
    const nlpClient: Client = new tencentcloud.nlp.v20190408.Client(config)
    return nlpClient
}