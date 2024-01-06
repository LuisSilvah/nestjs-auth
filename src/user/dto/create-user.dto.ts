import { Expose } from 'class-transformer';
import { User } from '../entities/user.entity';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches
} from 'class-validator';

export class CreateUserDto extends User {

  // @Transform(({ value }) => value.toLowerCase())

  @IsEmail()
  @IsNotEmpty(
    {
      message: "Verifique o email!"
    }
  )
  email: string;

  @IsString(
    {
      message: "Senha precisa ser string"
    }
  )
  @Length(4, 20, {
    message: "Senha precisa ter entre 4 a 20 caracteres"
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha muito fraca',
  })
  @Expose({ name: 'senha' })
  password: string;


  @IsString(
    {
      message: "Nome precisa ser string"
    }
  )
  @IsNotEmpty(
    {
      message: "Verifique o usuario!"
    }
  )
  @Expose({ name: 'nome' })
  name: string;
}