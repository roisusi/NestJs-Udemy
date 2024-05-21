import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.findByEmail(email);
    if (users) {
      throw new BadRequestException('Email already exists');
    }

    //hashing the password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = `${salt}.${hash.toString('hex')}`;

    //creating the user
    return await this.usersService.create(email, result);
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Email does not exist');
    }
    //hashing the password
    const [salt, storedHash] = user.password.split('.');
    const userPasswordHashed = (await scrypt(password, salt, 32)) as Buffer;

    if (userPasswordHashed.toString('hex') !== storedHash) {
      throw new BadRequestException('Password is incorrect');
    }
    return user;
  }
}
