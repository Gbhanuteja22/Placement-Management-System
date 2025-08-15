import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { StudentsController } from './students.controller';
import { HealthController } from './health.controller';
import { DatabaseTestController } from './database-test.controller';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/placement_management',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully');
            console.log('📊 Database:', connection.db?.databaseName);
          });
          connection.on('error', (error) => {
            console.log('❌ MongoDB connection error:', error.message);
          });
          connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
          });
          connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
          });
          return connection;
        },
      }),
    }),
    JobsModule,
    ApplicationsModule,
    UsersModule,
  ],
  controllers: [AuthController, StudentsController, HealthController, DatabaseTestController],
  providers: [],
})
export class AppModule {}
