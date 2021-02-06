import { Module } from '@nestjs/common';
import { XlsxService } from './xlsx.service';

@Module({
  providers: [XlsxService],
  exports: [XlsxService],
})
export class XlsxModule {}
