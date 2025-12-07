import { Test, TestingModule } from '@nestjs/testing';
import { AsignacionClasesController } from './asignacion-clases.controller';

describe('AsignacionClasesController', () => {
  let controller: AsignacionClasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsignacionClasesController],
    }).compile();

    controller = module.get<AsignacionClasesController>(AsignacionClasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
