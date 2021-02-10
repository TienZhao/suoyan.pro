import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ObjectUnsubscribedError } from 'rxjs';
import { AdminService } from './admin.service';
// import { AlignService } from './align/align.service';
import { LexicalAnalysisRequest, TextSimilarityRequest } from 'tencentcloud-sdk-nodejs/tencentcloud/services/nlp/v20190408/nlp_models'
import { TextTranslateRequest } from 'tencentcloud-sdk-nodejs/tencentcloud/services/tmt/v20180321/tmt_models';
import { ApiTags } from '@nestjs/swagger'
// import { AlignRequest } from './align/align.model';
import { AlignService } from './align/align.service'

@Controller()
@ApiTags('admin')
export class AdminController {
  constructor(
      private readonly adminService: AdminService,
      private readonly alignService: AlignService,
    ) {}

  @Get('get_hello')
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
    const req: LexicalAnalysisRequest = {
      Text: body.text
    }
    const postRes = this.adminService.lexicalAnalysis(req);
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

  @Post('text-translate')
  text_translate(@Body() body) {

    const req: TextTranslateRequest = {
      SourceText: body.src,
      Source: 'auto',
      /** 目标语言，各源语言的目标语言支持列表：https://cloud.tencent.com/document/product/551/15619 *        */
      Target: 'zh',
      ProjectId: 0
    }
    console.log(req)

    const postRes = this.adminService.textTranslaste(req)
    return postRes  
  }

  @Post('align')
  align(@Body() req) {
    const postRes = this.alignService.alignArticles(req)
    return postRes  
  }

  @Post('align_test')
  align_test(@Body() req) {
    const postRes = this.alignService.alignArticlesTest()
    return postRes  
  }

  @Post('export')
  export(@Body() data) {
    const postRes = this.adminService.ExportXlsx(data)
    return postRes  
  }
}

