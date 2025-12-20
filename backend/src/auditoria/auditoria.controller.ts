import { Controller, Get, Query } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';

@Controller('auditoria')
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get()
  async getAuditorias(
    @Query('operacion') operacion?: 'POST' | 'PUT' | 'DELETE',
  ) {
    return this.auditoriaService.obtenerAuditorias(operacion);
  }
}
