import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOne({
      where: { id },
    });
  }

  find(email: string) {
    return this.repo.find({
      where: { email },
    });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    return this.repo.save({ ...user, ...attrs });
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    return this.repo.remove(user);
  }

  createAndSaveUsersCollection() {
    const usersCollection: Partial<User>[] = [];

    for (let i = 0; i < 1000; i++) {
      const user: Partial<User> = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        company: faker.company.name(),
        vehicle: faker.vehicle.vehicle(),
      };

      usersCollection.push(user);
    }

    const users = this.repo.create(usersCollection);

    this.repo.save(users);
  }

  createUsers() {
    let counter = 0;

    const v = setInterval(() => {
      this.createAndSaveUsersCollection();

      counter++;
      if (counter === 3) {
        clearInterval(v);
      }
    }, 2000);
  }
}
