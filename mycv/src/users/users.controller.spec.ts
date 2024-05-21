import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';
import { User } from './users.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findByEmail: (email: string) => {
        return Promise.resolve({
          id: 1,
          email: email,
          password: '1234',
        } as User);
      },
      findById: (id: number) => {
        return Promise.resolve({
          id: id,
          email: 'roiwww@gmail.com',
          password: '1234',
        } as User);
      },
      // remove: (id: number) => {
      //   return Promise.resolve({
      //     id: id,
      //     email: 'roi@gmail.com',
      //     password: '1234',
      //   } as User);
      // },
      // update: (id: number, attributes: Partial<User>) => {
      //   return Promise.resolve({
      //     id: id,
      //     email: 'roi@gmail.com',
      //     password: '1234',
      //   } as User);
      // },
    };
    fakeAuthService = {
      signin: (email, password) => {
        return Promise.resolve({
          id: 1,
          email: email,
          password: password,
        } as User);
      },
      // signup: () => {},
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find user in find by id', async () => {
    const user = await controller.findUser(1);
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.email).toBe('roiwww@gmail.com');
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findById = () => null;
    await expect(controller.findUser(1)).rejects.toThrow(NotFoundException);
  });

  it('should signin updates session and return a user', async () => {
    const session = { userId: null };
    const user = await controller.signin(
      { email: 'roi@gmail.com', password: '1234' },
      session,
    );
    expect(user).toBeDefined();
    expect(user.id).toEqual(session.userId);
  });
});
