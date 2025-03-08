import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MinLength,
  IsString,
  MaxLength,
  IsEmail,
  Matches
} from 'class-validator';

export class UserAccountDto {

  @ApiProperty({
    example: "luis.giraldo3@utp.edu.co"
  })
  @IsNotEmpty()
  @MaxLength(100)
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    example: "estaEsUnaContraseñ@Segura123"
  })
  @IsNotEmpty()
  @MaxLength(64)
  @MinLength(8)
  @Matches(/^(?=.*[a-z])/, { message: 'Debe contener al menos una letra minúscula.' })
  @Matches(/^(?=.*[A-Z])/, { message: 'Debe contener al menos una letra mayúscula.' })
  @Matches(/^(?=.*\d)/, { message: 'Debe contener al menos un número.' })
  @Matches(/^(?=.*[@$!%*?&])/, { message: 'Debe contener al menos un carácter especial.' })
  @IsString()
  password: string;
}
