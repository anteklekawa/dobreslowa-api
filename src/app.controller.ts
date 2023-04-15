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
    const user = await this.appService.userLogin(userLoginDto);
    res.cookie('user', user.user, { httpOnly: true, expires: new Date(new Date().getTime() + 7200000) });
    res.send({ status: "success", user} );
  }

  @Get('/logout')
  async userLogout(@Req() req: Request) {
    const cookieValue = await req.cookies['user'];
    return this.appService.userLogout(cookieValue.userId);
  }
}
