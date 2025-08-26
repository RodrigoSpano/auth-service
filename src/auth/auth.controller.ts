import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import type { ILoginRequest } from 'src/types';
import { PublicEndpoint } from 'src/utils/ispublic.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicEndpoint()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req: ILoginRequest) {
    return this.authService.authenticate(req.user);
  }
}
