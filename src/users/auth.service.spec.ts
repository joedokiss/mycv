import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  const users: User[] = [];

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) => {
        const foundUsers = users.filter((user) => user.email === email);
        return Promise.resolve(foundUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create the auth service', async () => {
    expect(service).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await service.signup('asdf@asdf.com', 'aaa');

    expect.assertions(1);
    await expect(service.signup('asdf@asdf.com', 'bbb')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if user signs in with email not found', async () => {
    expect.assertions(1);
    await expect(service.signin('abcd@efg.com', 'abcd')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws an error if user signs in with invalid password', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { id: 1, email: 'abc@abc.com', password: 'abc' } as User,
    //   ]);
    await service.signup('abcd@abc.com', 'password');

    expect.assertions(1);
    await expect(service.signin('abcd@abc.com', 'password_xx')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('abc@abc.com', 'abcde');

    const user = await service.signin('abc@abc.com', 'abcde');
    expect(user).toBeDefined();
  });
});
