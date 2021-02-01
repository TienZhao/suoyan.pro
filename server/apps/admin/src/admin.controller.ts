import { Body, Controller, Get, Post } from '@nestjs/common';
import { ObjectUnsubscribedError } from 'rxjs';
import { AdminService } from './admin.service';
import { LexicalAnalysisRequest, TextSimilarityRequest } from 'tencentcloud-sdk-nodejs/tencentcloud/services/nlp/v20190408/nlp_models'

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getHello(): Promise<string> {
    const greeting = await this.adminService.getHello();
    return greeting
  }

  @Post('post')
  async postHello(): Promise<string> {
    const post = await this.adminService.postHello();
    return post
  }

  @Post('lexical_analysis')
  lexicalAnalysis(@Body() body) {
    const postRes = this.adminService.lexicalAnalysis(body);
    return postRes
  }

  @Post('sbd')
  sbd(@Body() body) {
    // console.log(body);
    const postRes = this.adminService.sbd(body);
    // console.log(postRes);
    return JSON.parse(JSON.stringify(postRes))
  }

  @Post('text_similarity')
  text_similarity(@Body() body) {

    console.log(body);

    const sbd_body = [{
        text: body.tgt,
        lang: 'zh'
    }]
    const sbd_res = this.adminService.sbd(sbd_body);
    body.tgtArray = sbd_res[0].sentenceArray

    const req: TextSimilarityRequest = {
      SrcText: body.src,
      TargetText: body.tgtArray,
    };
    
    const postRes = this.adminService.textSimilarity(req);
    // console.log(postRes);
    return postRes
  }
}

