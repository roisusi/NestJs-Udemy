import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.userRepo.create({ email, password });
    return this.userRepo.save(user);
  }

  findById(id: number) {
    if (!id) {
      return null;
    }
    //because findOneBy returns the first result in table if we send a null in SQLite
    return this.userRepo.findOneBy({ id });
  }

  find() {
    return this.userRepo.find();
  }

  findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async update(id: number, attributes: Partial<User>) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      return null;
    }
    this.userRepo.merge(user, attributes);
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      return null;
    }
    return this.userRepo.remove(user);
  }
}
