import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { CreateIdpUserDto } from './dto/create-idp-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateIdpUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async upsertBySub(data: CreateIdpUserDto) {
    return this.prisma.user.upsert({
      where: { sub: data.sub },
      update: {
        email: data.email,
        name: data.name,
      },
      create: data,
    });
  }

  async findBySub(sub: string) {
    return this.prisma.user.findUnique({
      where: { sub },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  //Get all users (excluding passwords)
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
