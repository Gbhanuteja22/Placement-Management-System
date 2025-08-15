import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserProfileDto, UpdateUserProfileDto } from './dto/user-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('profile')
  async createProfile(@Body() createProfileDto: CreateUserProfileDto) {
    try {
      console.log('🎯 Profile creation endpoint called');
      const result = await this.usersService.createProfile(createProfileDto);
      console.log('✅ Profile created successfully in controller');
      return result;
    } catch (error) {
      console.error('❌ Error in profile creation controller:', error);
      throw error;
    }
  }

  @Get('profile/:clerkUserId')
  async getProfile(@Param('clerkUserId') clerkUserId: string) {
    return this.usersService.getProfile(clerkUserId);
  }

  @Put('profile/:clerkUserId')
  async updateProfile(
    @Param('clerkUserId') clerkUserId: string,
    @Body() updateProfileDto: UpdateUserProfileDto
  ) {
    return this.usersService.updateProfile(clerkUserId, updateProfileDto);
  }

  @Get('profile/:clerkUserId/check-onboarding')
  async checkOnboardingStatus(@Param('clerkUserId') clerkUserId: string) {
    return this.usersService.checkOnboardingStatus(clerkUserId);
  }
}
