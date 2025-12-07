import { Test, TestingModule } from '@nestjs/testing';
import { TutoresService } from './tutores.service';

describe('TutoresService', () => {
  let service: TutoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TutoresService],
    }).compile();

    service = module.get<TutoresService>(TutoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
