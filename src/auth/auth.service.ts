import { Injectable } from '@nestjs/common';
import bcrypt = require('bcrypt');
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
    const { email, password } = registerDto;

    // Generar el hash de la contraseña con 12 rondas de salt
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Guardar el usuario mediante UsersService
    const user = await this.usersService.create(email, passwordHash);

    // Retornar el usuario sin incluir el hash ni la contraseña
    const { passwordHash: _, ...result } = user;
    return result;
  }
}