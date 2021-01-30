import { Test, TestingModule } from '@nestjs/testing';
import { TencentcloudService } from './tencentcloud.service';

describe('TencentcloudService', () => {
  let service: TencentcloudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TencentcloudService],
    }).compile();

    service = module.get<TencentcloudService>(TencentcloudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
