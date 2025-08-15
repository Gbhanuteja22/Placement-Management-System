import { Controller, Get } from '@nestjs/common';

@Controller('students')
export class StudentsController {
  @Get()
  getStudents() {
    return {
      message: 'Students endpoint',
      data: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          department: 'Computer Science',
          batch: 2024
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          department: 'Information Technology',
          batch: 2024
        }
      ]
    };
  }

  @Get('dashboard')
  getDashboard() {
    return {
      message: 'Student dashboard data',
      stats: {
        applications: 12,
        interviews: 5,
        offers: 2,
        profileCompletion: 85
      },
      recentActivity: [
        'Applied to Software Engineer position at TechCorp',
        'Interview scheduled with DataSoft for tomorrow',
        'Received offer from WebTech Solutions'
      ]
    };
  }
}
