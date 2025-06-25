import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserDto } from './dto/user.dto';
import { AuthPayload } from './dto/auth-payload.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User & Document>,
    private jwtService: JwtService,
  ) {}

  private mapMongooseUserToDto(user: User & Document): UserDto {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    };
  }

  async login(email: string, password: string): Promise<AuthPayload> {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      _id: user._id.toString(), // Cambiamos sub por _id
      email: user.email,
      role: user.role,
    };
    // console.log('login: Payload:', payload);
    return {
      token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: this.mapMongooseUserToDto(user),
    };
  }

  async register(createUserInput: CreateUserInput): Promise<AuthPayload> {
    const { email, password, name, role } = createUserInput;
    const existingUser = await this.userModel.findOne({ email });
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
    const payload = {
      _id: user._id.toString(), // Cambiamos sub por _id
      email: user.email,
      role: user.role,
    };
    console.log('register: Payload:', payload);
    return {
      token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: this.mapMongooseUserToDto(user),
    };
  }

  async updateProfile(
    id: string,
    updateUserInput: UpdateUserInput,
  ): Promise<UserDto> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserInput, {
      new: true,
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.mapMongooseUserToDto(user);
  }

  async findOne(id: string): Promise<UserDto | null> {
    // console.log('authService.findOne: ID:', id);
    const user = await this.userModel.findById(id);
    // console.log('authService.findOne: User:', user);
    return user ? this.mapMongooseUserToDto(user) : null;
  }
}
