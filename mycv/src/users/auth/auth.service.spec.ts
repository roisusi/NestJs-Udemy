import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users.service';
import { User } from '../users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  const users: User[] = [];
  beforeEach(async () => {
    //create a fake copy of the users service
    fakeUsersService = {
      findByEmail: (email: string) => {
        const filterUsers = users.find((u) => u.email === email);
        return Promise.resolve(filterUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.random() * 999999, email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salt and hashed password', async () => {
    const user = await service.signup('roi99@gmail.com', '12345');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('roiaa@gmail.com', '12345');

    //signup with email that is in use so u get an error, except it to the test
    await expect(service.signup('roiaa@gmail.com', '12345')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('roi4@gmail.com', '1234');
    await expect(service.signin('roi4@gmail.com', '12344')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('check it the password is ok', async () => {
    await service.signup('roi@gmail.com', '1234');
    const user = await service.signin('roi@gmail.com', '1234');
    expect(user).toBeDefined();
  });
});
