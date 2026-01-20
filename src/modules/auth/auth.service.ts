import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, fullName } = registerDto;
    
    const existingUser = await this.usersService.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      fullName,
      passwordHash,
      role: 'USER', // Default role
    });

    const { passwordHash: _, ...result } = user;
    return {
      user: result,
      access_token: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { passwordHash: _, ...result } = user;
      return {
        user: result,
        access_token: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }),
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async validateUser(userId: string) {
    const user = await this.usersService.findOne({ id: userId });
    if (user) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }
}
