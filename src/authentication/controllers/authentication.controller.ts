import { Body, Controller, Get, HttpCode, Post, Req, Res, SerializeOptions, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { RegisterDto } from '../dto/register.dto';
import { JwtAuthenticationGuard } from '../guards/jwt-authentication.guard';
import { LocalAuthenticationGuard } from '../guards/local-authentication.guard';
import { RequestWithUser } from '../request-with-user.interface';
import { AuthenticationService } from '../services/authentication.service';

@Controller('authentication')
@SerializeOptions({
    strategy: 'exposeAll'
})
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) {}

    @Post('register')
    async register(@Body() register: RegisterDto) {
        return this.authenticationService.register(register);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('log-in')
    async logIn(@Req() request: RequestWithUser) {
        const { user } = request;
        const cookie = this.authenticationService.getCookieWithJwtToken(user.id);

        request.res.setHeader('Set-Cookie', cookie);

        return user;
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('log-out')
    async logOut(@Res() response: Response) {
        response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogout());
        return response.sendStatus(200);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    authenticate(@Req() request: RequestWithUser) {
        const user = request.user;
        return user;
    }
}
