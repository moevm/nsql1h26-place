import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { UsersService } from '../models/users/users.service';
import { User } from '../models/users/schemas/users.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds = 12;

  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByUsername(registerDto.username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, this.saltRounds);
    const userId = randomBytes(12).toString('hex');

    const user = await this.usersService.create({
      _id: userId,
      username: registerDto.username,
      password_hash: passwordHash,
    });

    return {
      user: this.toSafeUser(user),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      token: randomBytes(24).toString('hex'),
      user: this.toSafeUser(user),
    };
  }

  private toSafeUser(user: User) {
    return {
      _id: user._id,
      username: user.username,
      image_path: user.image_path,
    };
  }
}
