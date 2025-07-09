import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  private mapMongooseUserToDto(user: User): UserDto {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login(email: string, password: string): Promise<AuthPayload> {
    const user = await this.userModel.findOne({ email }).exec();
    this.logger.log(`Login attempt for email: ${email}`);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      this.logger.warn(`Failed login attempt for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    this.logger.log(`Login successful for user: ${user.email}`);
    return {
      token: this.jwtService.sign(payload),
      user: this.mapMongooseUserToDto(user),
    };
  }

  async register(createUserInput: CreateUserInput): Promise<AuthPayload> {
    const { email, password, name, role } = createUserInput;
    const existingUser = await this.userModel.findOne({ email }).exec();
    this.logger.log(`Registration attempt for email: ${email}`);
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
    this.logger.log(`User registered: ${user.email}`);
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    return {
      token: this.jwtService.sign(payload),
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
    this.logger.log(`Updating profile for user ID: ${id}`);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.mapMongooseUserToDto(user);
  }

  async updateUserById(
    id: string,
    updateUserInput: UpdateUserInput,
  ): Promise<UserDto> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserInput, { new: true })
      .exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.mapMongooseUserToDto(user);
  }

  async findOne(id: string): Promise<UserDto | null> {
    this.logger.log(`Finding user by ID: ${id}`);
    const user = await this.userModel.findById(id).exec();
    return user ? this.mapMongooseUserToDto(user) : null;
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => this.mapMongooseUserToDto(user));
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async countUsers(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
}