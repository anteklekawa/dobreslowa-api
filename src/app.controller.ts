import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { AppService } from './app.service';
import { UserRegisterDto } from "./dtos/user-register.dto";
import { UserLoginDto } from "./dtos/user-login.dto";
import { Request, Response } from "express";

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/register')
  userRegister(@Body() userRegisterDto: UserRegisterDto){
    return this.appService.userRegister(userRegisterDto);
  }

  @Post('/login')
  async userLogin(@Body() userLoginDto: UserLoginDto, @Res() res: Response) {
    const data = await this.appService.userLogin(userLoginDto);
    res.cookie('user', data.user);
    res.send({ message: "Cookie set successfully", data });
  }

  @Get('/logout')
  async userLogout(@Req() req: Request) {
    const cookieValue = await req.cookies['user'];
    return this.appService.userLogout(cookieValue.userId);
  }
}
