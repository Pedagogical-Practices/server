import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthPayload } from './dto/auth-payload.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthPayload> {
    const user = await this.userModel.findOne({ email }).exec();
    this.logger.log(`Login attempt for email: ${email}`);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      this.logger.warn(`Failed login attempt for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    this.logger.log(`Login successful for user: ${user.email}`);
    return {
      token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const { firstName, lastName, email, password, roles } = createUserInput;
    const existingUser = await this.userModel.findOne({ email }).exec();
    this.logger.log(`User creation attempt for email: ${email}`);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roles,
    });
    this.logger.log(`User created: ${user.email}`);
    return user;
  }

  async updateUser(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserInput, { new: true })
      .exec();
    this.logger.log(`Updating user ID: ${id}`);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async findOne(id: string): Promise<User | null> {
    this.logger.log(`Finding user by ID: ${id}`);
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users;
  }

  async findManyByIds(ids: string[]): Promise<User[]> {
    return this.userModel.find({ _id: { $in: ids } }).exec();
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}