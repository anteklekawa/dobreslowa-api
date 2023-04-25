import { Body, Controller, Get, Headers, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
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
    res.cookie('user', user.user);
    res.send({ status: "success", ...user} );
  }

  @Get('/logout')
  async userLogout(@Req() req: Request) {
    const cookieValue = await req.cookies['user'];
    return this.appService.userLogout(cookieValue.userId);
  }

  @Get('/refresh-token')
  async refreshToken(@Headers('Authorization') headers) {
    if (!headers) throw new UnauthorizedException('There is no access token!')
    const accessToken = headers.slice(7);
    return this.appService.refreshToken(accessToken);
  }
}
