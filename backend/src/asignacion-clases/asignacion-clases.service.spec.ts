import { Test, TestingModule } from '@nestjs/testing';
import { AsignacionClasesService } from './asignacion-clases.service';

describe('AsignacionClasesService', () => {
  let service: AsignacionClasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsignacionClasesService],
    }).compile();

    service = module.get<AsignacionClasesService>(AsignacionClasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
