import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ValidateUserDto } from './dto/validate-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';

@ApiTags('User')
@Controller({
  version: '1',
  path: 'auth',
})
@UseGuards(ThrottlerGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // create a regular user
  @Post('/signup/user')
  create(@Body() createUserDto: CreateUserDto) {
    // Ensure no admin-specific fields are present for regular users
    if (createUserDto.isAdmin || createUserDto.adminKey) {
      throw new UnauthorizedException(
        'Regular users cannot provide isAdmin or adminKey',
      );
    }
    return this.userService.createUser(createUserDto);
  }

  // create an admin
  @Post('/signup/admin')
  adminSignup(@Body() createAdminDto: CreateAdminUserDto) {
    return this.userService.createAdminUser(createAdminDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() validateUserDto: ValidateUserDto) {
    const validatedUser = await this.userService.validateUser(validateUserDto);
    return this.userService.login(validatedUser);
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
