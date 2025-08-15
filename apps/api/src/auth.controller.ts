import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('status')
  getStatus() {
    return {
      message: 'Authentication service is running',
      timestamp: new Date().toISOString()
    };
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    // TODO: Implement actual authentication
    return {
      message: 'Login endpoint (demo)',
      email: body.email,
      token: 'demo-jwt-token',
      user: {
        id: '1',
        email: body.email,
        role: 'STUDENT'
      }
    };
  }

  @Post('register')
  register(@Body() body: { email: string; password: string; role: string }) {
    // TODO: Implement actual registration
    return {
      message: 'Registration endpoint (demo)',
      email: body.email,
      user: {
        id: '1',
        email: body.email,
        role: body.role || 'STUDENT'
      }
    };
  }
}
