import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { ValidateUserDto } from './dto/validate-user.dto';
import { ConfigService } from '@nestjs/config';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // create regular user
  async createUser(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        isAdmin: false,
      },
    });
    return createdUser;
  }

  // create admin user
  async createAdminUser(createAdminDto: CreateAdminUserDto) {
    const { username, password, adminKey } = createAdminDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    if (
      !adminKey ||
      adminKey !== this.configService.get<string>('ADMIN_SIGNUP_KEY')
    ) {
      throw new UnauthorizedException('Invalid admin key');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdAdmin = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        isAdmin: true,
      },
    });
    return createdAdmin;
  }

  async validateUser(validateUserDto: ValidateUserDto): Promise<any> {
    const { username, password } = validateUserDto;

    const user = await this.prisma.user.findUnique({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const result = { ...user };
      delete result.password;
      return result; // Return user object without password
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(validatedUser: any) {
    const secretKey = this.configService.get<string>('SECRET_KEY');
    console.log('JWT secret being used:', secretKey);

    if (!secretKey) {
      throw new Error('SECRET_KEY not found');
    }

    const payload = {
      sub: validatedUser.id,
      username: validatedUser.username,
      isAdmin: validatedUser.isAdmin,
    };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findUserById(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.delete({ where: { id: userId } });
  }
}
