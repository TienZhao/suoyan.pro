import { Test, TestingModule } from '@nestjs/testing';
import { AlignService } from './align.service';

describe('AlignService', () => {
  let service: AlignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlignService],
    }).compile();

    service = module.get<AlignService>(AlignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
