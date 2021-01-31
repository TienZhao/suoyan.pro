import { Body, Controller, Get, Post } from '@nestjs/common';
import { ObjectUnsubscribedError } from 'rxjs';
import { AdminService } from './admin.service';

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
}

