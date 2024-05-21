import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth/auth.service';
import { CurrentUser } from './decorators/currect-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  //verify if the user is logged in or not
  // @Get('/isLoggedIn')
  // isLoggedIn(@Session() session: any) {
  //   return this.usersService.findById(session.userId);
  // }

  @UseGuards(AuthGuard)
  @Get('/isLoggedIn')
  isLoggedIn(@CurrentUser() user: User) {
    return user;
  }

  //logout
  @Post('/logout')
  logout(@Session() session: any) {
    session.userId = null;
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/users/:id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersService.findById(id);
  }

  @Get('/users')
  findAllUsers() {
    return this.usersService.find();
  }

  @Put('/users/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const user = await this.usersService.update(+id, body);
    if (user) {
      return user;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  @Delete('/users/:id')
  async removeUser(@Param('id') id: string) {
    const user = await this.usersService.remove(+id);
    if (user) {
      return user;
    } else {
      throw new NotFoundException('User not found');
    }
  }
}
