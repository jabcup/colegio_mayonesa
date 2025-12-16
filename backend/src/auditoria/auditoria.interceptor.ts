import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditoriaService } from './auditoria.service';

interface RequestConUsuario extends Request {
  user?: { id?: number };
  originalUrl?: string;
}

interface ResponseConId {
  id?: number;
  [key: string]: any; // Para no perder otras propiedades
}

@Injectable()
export class AuditoriaInterceptor implements NestInterceptor {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseConId> {
    const request: RequestConUsuario = context.switchToHttp().getRequest();
    const method = request.method ?? '';
    const originalUrl = request.originalUrl ?? '';
    const body = request.body;
    const user = request.user;
    const usuarioId: number | null = user?.id ?? null;

    const noAuditar = ['/usuarios/login', '/usuarios/registro'];
    if (noAuditar.some((ruta) => originalUrl.includes(ruta))) {
      return next.handle() as Observable<ResponseConId>;
    }

    if (!['POST', 'PUT', 'DELETE'].includes(method)) {
      return next.handle() as Observable<ResponseConId>;
    }

    return next.handle().pipe(
      tap((response: ResponseConId) => {
        const idRegistro: number | null = response?.id ?? null;

        this.auditoriaService
          .registrar({
            tabla: this.obtenerTablaDesdeUrl(originalUrl),
            operacion: method as 'POST' | 'PUT' | 'DELETE',
            idRegistro,
            datosAntes: method === 'PUT' ? body : null,
            datosDespues: response ?? null,
            usuarioId,
          })
          .catch((err) => console.error('Error registrando auditoría:', err));
      }),
    );
  }

  private obtenerTablaDesdeUrl(url: string): string {
    return url.split('/')[1] || 'desconocido';
  }
}
