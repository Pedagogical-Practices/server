// server/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserDto } from './dto/user.dto';
import { AuthPayload } from './dto/auth-payload.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  private mapMongooseUserToDto(user: User): UserDto {
    return {
      sub: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login(email: string, password: string): Promise<AuthPayload> {
    const user = await this.userModel.findOne({ email }).exec();
    console.log('auth.service.ts: login, user found:', user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    console.log('auth.service.ts: login, payload:', payload);
    return {
      token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: this.mapMongooseUserToDto(user),
    };
  }

  async register(createUserInput: CreateUserInput): Promise<AuthPayload> {
    const { email, password, name, role } = createUserInput;
    const existingUser = await this.userModel.findOne({ email }).exec();
    console.log('auth.service.ts: register, existingUser:', existingUser);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      name,
      role,
    });
    console.log('auth.service.ts: register, created user:', user);
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    return {
      token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: this.mapMongooseUserToDto(user),
    };
  }

  async updateProfile(
    id: string,
    updateUserInput: UpdateUserInput,
  ): Promise<UserDto> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserInput, { new: true })
      .exec();
    console.log('auth.service.ts: updateProfile, updated user:', user);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.mapMongooseUserToDto(user);
  }

  async findOne(id: string): Promise<UserDto | null> {
    console.log('auth.service.ts: findOne, id:', id);
    const user = await this.userModel.findById(id).exec();
    console.log('auth.service.ts: findOne, user found:', user);
    return user ? this.mapMongooseUserToDto(user) : null;
  }
}
