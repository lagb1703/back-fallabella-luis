import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateEnterpriseDto {
  @IsString({ message: 'El campo empresa es de tipo texto' })
  @MaxLength(120, {
    message: 'El campo empresa debe de contener maximo 120 caracteres ',
  })
  @IsNotEmpty({ message: 'El campo empresa no debe de estar vacio' })
  enterprise: string;

  @IsString({ message: 'El campo nit es de tipo texto' })
  @MaxLength(20, {
    message: 'El campo nit debe de contener maximo 20 caracteres ',
  })
  @IsNotEmpty({ message: 'El campo nit no debe de estar vacio' })
  nit: string;

  @IsString({ message: 'El campo telefono es de tipo texto' })
  @MaxLength(15, {
    message: 'El campo telefono debe de contener maximo 15 caracteres ',
  })
  phone: string;

  @IsString({ message: 'El campo website es de tipo texto' })
  @MaxLength(150, {
    message: 'El campo website debe de contener maximo 150 caracteres ',
  })
  website: string;

  @IsString({ message: 'El campo direccion es de tipo texto' })
  @MaxLength(150, {
    message: 'El campo direccion debe de contener maximo 150 caracteres ',
  })
  address: string;

  @IsNumber()
  isActive: number;
}
