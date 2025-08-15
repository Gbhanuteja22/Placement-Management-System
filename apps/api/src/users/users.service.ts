import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserProfile, UserProfileDocument } from './schemas/user-profile.schema';
import { CreateUserProfileDto, UpdateUserProfileDto } from './dto/user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserProfile.name) private userProfileModel: Model<UserProfileDocument>
  ) {}

  async createProfile(createProfileDto: CreateUserProfileDto): Promise<UserProfile> {
    try {
      console.log('📝 Creating profile for user:', createProfileDto.clerkUserId);
      console.log('📝 Profile data:', JSON.stringify(createProfileDto, null, 2));
      
      const createdProfile = new this.userProfileModel({
        ...createProfileDto,
        isOnboardingComplete: true
      });
      
      console.log('💾 Attempting to save profile to MongoDB...');
      const savedProfile = await createdProfile.save();
      console.log('✅ Profile saved successfully:', savedProfile._id);
      
      return savedProfile;
    } catch (error) {
      console.error('❌ Error creating profile:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        keyPattern: error.keyPattern,
        keyValue: error.keyValue
      });
      throw error;
    }
  }

  async getProfile(clerkUserId: string): Promise<UserProfile> {
    const profile = await this.userProfileModel.findOne({ clerkUserId }).exec();
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    return profile;
  }

  async updateProfile(clerkUserId: string, updateProfileDto: UpdateUserProfileDto): Promise<UserProfile> {
    const updatedProfile = await this.userProfileModel
      .findOneAndUpdate({ clerkUserId }, updateProfileDto, { new: true })
      .exec();
    
    if (!updatedProfile) {
      throw new NotFoundException('User profile not found');
    }
    
    return updatedProfile;
  }

  async checkOnboardingStatus(clerkUserId: string): Promise<{ isOnboardingComplete: boolean; hasProfile: boolean }> {
    const profile = await this.userProfileModel.findOne({ clerkUserId }).exec();
    
    if (!profile) {
      return { isOnboardingComplete: false, hasProfile: false };
    }
    
    return { 
      isOnboardingComplete: profile.isOnboardingComplete, 
      hasProfile: true 
    };
  }

  async findByClerkUserId(clerkUserId: string): Promise<UserProfile | null> {
    return this.userProfileModel.findOne({ clerkUserId }).exec();
  }
}
