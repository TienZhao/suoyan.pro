import { Test, TestingModule } from '@nestjs/testing';
import { XlsxService } from './xlsx.service';

describe('XlsxService', () => {
  let service: XlsxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XlsxService],
    }).compile();

    service = module.get<XlsxService>(XlsxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
