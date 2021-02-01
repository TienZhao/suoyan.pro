import { Test, TestingModule } from '@nestjs/testing';
import { SbdService } from './sbd.service';

describe('SbdService', () => {
  let service: SbdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SbdService],
    }).compile();

    service = module.get<SbdService>(SbdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
