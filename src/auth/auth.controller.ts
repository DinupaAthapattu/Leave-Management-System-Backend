import { Controller, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const token = await this.authService.login(body.email, body.password);
      return {
        message: 'Login successful',
        access_token: token.access_token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid email or password');
      }
      console.error('Unexpected login error:', error);
      throw new BadRequestException('Login failed due to server error');
    }
  }
}
