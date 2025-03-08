import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MinLength,
  IsString,
  MaxLength,
  IsEmail,
  Matches,
  IsNumber,
  Min,
  Max
} from 'class-validator';

export class UserDto {

  @ApiProperty({
    example: "luis.giraldo3@utp.edu.co"
  })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    example: "estaEsUnaContraseñ@Segura123"
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/^(?=.*[a-z])/, { message: 'Debe contener al menos una letra minúscula.' })
  @Matches(/^(?=.*[A-Z])/, { message: 'Debe contener al menos una letra mayúscula.' })
  @Matches(/^(?=.*\d)/, { message: 'Debe contener al menos un número.' })
  @Matches(/^(?=.*[@$!%*?&])/, { message: 'Debe contener al menos un carácter especial.' })
  @IsString()
  password: string;

  @ApiProperty({
    example: "Luis Alejandro"
  })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  @IsString()
  names: string;

  @ApiProperty({
    example: "Giraldo Bolaños"
  })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  @IsString()
  lastNames: string;

  @ApiProperty({
    example: 1004685950
  })
  @IsNotEmpty()
  @Min(0)
  @IsNumber()
  identification: number;

  @ApiProperty({
    example: 3017222568
  })
  @IsNotEmpty()
  @Min(3000000000)
  @Max(3600000000)
  @IsNumber()
  phone: number;

  @ApiProperty({
    example: 1
  })
  @IsNotEmpty()
  @Min(0)
  @IsNumber()
  documentTypeId: number;
}
