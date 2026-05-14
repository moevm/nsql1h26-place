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

    const user = await this.usersService.create({
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

    const token = randomBytes(24).toString('hex');
    const updatedUser = await this.usersService.setAuthToken(user._id, token);

    return {
      token,
      user: this.toSafeUser(updatedUser ?? user),
    };
  }

  async validateToken(token: string) {
    if (!token) {
      return null;
    }

    const user = await this.usersService.findByToken(token);
    if (!user) {
      return null;
    }

    return this.toSafeUser(user);
  }

  private toSafeUser(user: User) {
    return {
      _id: user._id,
      username: user.username,
      image_path: user.image_path,
    };
  }
}
