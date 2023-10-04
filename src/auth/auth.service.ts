import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // Generate PW Hash
    try {
      const hash = await argon.hash(dto.password);
      // Save the New User in the DB
      const user = await this.prisma.user.create({
        data: { email: dto.email, hash },
      });
      // Retuen the User
      delete user.hash;
      return user;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ForbiddenException('Credentials Taken');
      }
      throw e;
    }
  }

  async signin(dto: AuthDto) {
    // find User by Email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new ForbiddenException('Credentials Incorrect');
    const pwMatched = await argon.verify(user.hash, dto.password);
    if (!pwMatched) throw new ForbiddenException('Password did not match');
    // If Password is not corre
    delete user.hash;
    return user;
  }
}
