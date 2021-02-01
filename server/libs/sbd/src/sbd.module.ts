import { Module } from '@nestjs/common';
import { SbdService } from './sbd.service';

@Module({
  providers: [SbdService],
  exports: [SbdService],
})
export class SbdModule {}
