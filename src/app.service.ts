import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRegisterDto } from "./dtos/user-register.dto";
import { PrismaClient } from "@prisma/client";
import { uuid } from "uuidv4";
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from "./dtos/user-login.dto";
import { sha256 } from "js-sha256";
const prisma = new PrismaClient()

@Injectable()
export class AppService {

  async userRegister(userRegisterDto: UserRegisterDto) {
    const isUsernameExisting = await prisma.users.findMany({
      where: {
        username: userRegisterDto.username
      }
    })

    const isEmailExisting = await prisma.users.findMany({
      where: {
        email: userRegisterDto.email
      }
    })
    if (isUsernameExisting.length > 0) throw new UnauthorizedException('Username is already taken!');
    if (isEmailExisting.length > 0) throw new UnauthorizedException('Email is already taken!');

    const currPassword = userRegisterDto.password;
    userRegisterDto.password = await bcrypt.hash(currPassword, 10);

    try {
      const user = await prisma.users.create({
        data: {
          userId: uuid(),
          posts: '',
          roles: 2001,
          accessToken: '',
          email: userRegisterDto.email,
          password: userRegisterDto.password,
          username: userRegisterDto.username,
          name: userRegisterDto.name,
          surname: userRegisterDto.surname,
        }
      })
      delete user.password;
      return { user, status: "success" }
    } catch (error) {
      return { error, status: "error"}
    }
  }

  async userLogin(userLoginDto: UserLoginDto) {
      const user = await prisma.users.findFirst({
        where: {
          OR: [
            {
              username: userLoginDto.login
            },
            {
              email: userLoginDto.login
            }
          ]
        },
        select: {
          userId: true,
          email: true,
          roles: true,
          username: true,
          password: true
        }
      });
      const isMatch = await bcrypt.compare(userLoginDto.password, user.password);
      if (!isMatch) throw new UnauthorizedException('Creditentials are invalid!');

      const stringToHash = uuid().toString() + user.userId + user.username;
      const accessToken = sha256(stringToHash);

      const insertToken = await prisma.users.update({
        where: {
          userId: user.userId,
        },
        data: {
          accessToken,
        }
      });

      setTimeout(async () => {
        await prisma.users.update({
          where: {
            userId: user.userId
          },
          data: {
            accessToken: ''
          }
        })
      }, 7200000);

      delete user.password;
      const roles = [];
      user.roles.map(role => { roles.push(role) });
      delete user.roles;

      return { user: {...user, roles, accessToken} }
    }

    async userLogout(userId: string) {
      const logoutUser = await prisma.users.update({
        where: {
          userId,
        },
        data: {
          accessToken: ''
        }
      })
      return { status: "success" }
    }
}
