import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateIdpUserDto } from './dto/create-idp-user.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateIdpUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  async upsertFromIdp(dto: CreateIdpUserDto) {
    return this.usersRepository.upsertBySub(dto);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async findBySub(sub: string) {
    return this.usersRepository.findBySub(sub);
  }

  async findById(id: string) {
    return this.usersRepository.findById(id);
  }

  async findAll() {
    return this.usersRepository.findAll();
  }
}
