import { Controller, Get, Query } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { VistaPagosEstudiantesView } from './vista-pagos.entity';

@ApiTags('Reportes')
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('PagosEstudiantes')
  @ApiOkResponse({
    description: 'Lista de pagos filtrados de estudiantes',
    type: VistaPagosEstudiantesView,
    isArray: true,
  })
  getPagos(
    @Query('curso') curso?: string,
    @Query('estado') estado?: string,
    @Query('mes') mes?: number,
    @Query('anio') anio?: number,
  ) {
    return this.reportesService.buscarPagos({
      curso,
      estadoPago: estado,
      mesPago: Number(mes),
      anioPago: Number(anio),
    });
  }
}
