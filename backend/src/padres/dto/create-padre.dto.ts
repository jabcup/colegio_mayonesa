import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional} from "class-validator";

export class CreatePadreDto {
  @ApiProperty({
    example: 'Juan Andres',
    description: 'Nombres de pila del padre de familia',
  })
  @IsNotEmpty()
  @IsString()
  nombres: string;

  @ApiProperty({
    example: 'Diaz',
    description: 'Primer apellido del padre de familia',
  })
  @IsNotEmpty()
  @IsString()
  apellidoPat: string;


  @ApiProperty({
    example: 'Diaz',
    description: 'Segundo apellido del padre de familia',
  })
  @IsOptional()
  @IsString()
  apellidoMat: string;
  
  @ApiProperty({
    example: '12345678',
    description: 'Numero de telefono de contacto del padre de familia',
  })
  @IsNotEmpty()
  @IsString()
  telefono: string;
}
