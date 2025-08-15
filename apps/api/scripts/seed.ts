import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { JobsService } from '../src/jobs/jobs.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const jobsService = app.get(JobsService);

  console.log('🌱 Seeding database with initial job data...');

  // Sample on-campus jobs
  const onCampusJobs = [
    {
      title: "Software Development Engineer",
      company: "Microsoft",
      location: "Hyderabad",
      salary: "₹18-22 LPA",
      type: "Full-time",
      experience: "0-2 years",
      description: "Join Microsoft as an SDE and work on cutting-edge technologies. You'll be working on Azure cloud services, developing scalable solutions, and collaborating with teams across the globe.",
      requirements: ["React.js", "C#", ".NET", "Azure", "JavaScript", "SQL"],
      isOnCampus: true,
      urgent: true,
      rating: 4.8,
      employees: "10,000+",
      source: "campus",
      benefits: ["Health Insurance", "Stock Options", "Remote Work", "Learning Budget"],
      minSalary: 18,
      maxSalary: 22,
      category: "Software Development"
    },
    {
      title: "Product Manager",
      company: "Google",
      location: "Bangalore",
      salary: "₹25-30 LPA",
      type: "Full-time",
      experience: "2-4 years",
      description: "Lead product initiatives at Google. Define product strategy, work with engineering teams, and drive product development from conception to launch.",
      requirements: ["Product Strategy", "Analytics", "Communication", "SQL", "Data Analysis"],
      isOnCampus: true,
      urgent: true,
      rating: 4.9,
      employees: "50,000+",
      source: "campus",
      benefits: ["Health Insurance", "Stock Options", "Flexible Hours", "Free Meals"],
      minSalary: 25,
      maxSalary: 30,
      category: "Product Management"
    },
    {
      title: "Data Scientist",
      company: "Amazon",
      location: "Chennai",
      salary: "₹20-24 LPA",
      type: "Full-time",
      experience: "1-3 years",
      description: "Work with big data at Amazon. Build machine learning models, analyze customer behavior, and drive data-driven decision making across various business units.",
      requirements: ["Python", "Machine Learning", "Statistics", "SQL", "TensorFlow", "AWS"],
      isOnCampus: true,
      urgent: false,
      rating: 4.7,
      employees: "100,000+",
      source: "campus",
      benefits: ["Health Insurance", "Stock Options", "Career Development", "Relocation Support"],
      minSalary: 20,
      maxSalary: 24,
      category: "Data Science"
    },
    {
      title: "DevOps Engineer",
      company: "Flipkart",
      location: "Hyderabad",
      salary: "₹15-18 LPA",
      type: "Full-time",
      experience: "1-3 years",
      description: "Manage cloud infrastructure and CI/CD pipelines at Flipkart. Work with containerization, orchestration, and automation tools.",
      requirements: ["AWS", "Docker", "Kubernetes", "Jenkins", "Linux", "Python"],
      isOnCampus: true,
      urgent: false,
      rating: 4.5,
      employees: "5,000+",
      source: "campus",
      benefits: ["Health Insurance", "Performance Bonus", "Flexible Work", "Training Programs"],
      minSalary: 15,
      maxSalary: 18,
      category: "DevOps"
    }
  ];

  // Sample external jobs
  const externalJobs = [
    {
      title: "Frontend Developer",
      company: "Startup Hub",
      location: "Remote",
      salary: "₹8-12 LPA",
      type: "Full-time",
      experience: "1-2 years",
      description: "Build amazing user interfaces for our web applications. Work with modern technologies and a young dynamic team in a fast-paced startup environment.",
      requirements: ["React", "TypeScript", "CSS", "JavaScript", "Git"],
      isOnCampus: false,
      urgent: false,
      rating: 4.2,
      employees: "50+",
      source: "external",
      applyUrl: "https://example.com/apply",
      benefits: ["Health Insurance", "Flexible Hours", "Remote Work", "Stock Options"],
      minSalary: 8,
      maxSalary: 12,
      category: "Frontend Development"
    },
    {
      title: "Backend Engineer",
      company: "TechCorp Solutions",
      location: "Mumbai",
      salary: "₹10-15 LPA",
      type: "Full-time",
      experience: "2-4 years",
      description: "Develop and maintain backend services for our e-commerce platform. Work with microservices architecture and handle high-traffic applications.",
      requirements: ["Node.js", "MongoDB", "Express", "Docker", "AWS", "REST APIs"],
      isOnCampus: false,
      urgent: true,
      rating: 4.3,
      employees: "500+",
      source: "external",
      applyUrl: "https://techcorp.com/careers",
      benefits: ["Health Insurance", "Performance Bonus", "Career Growth", "Team Outings"],
      minSalary: 10,
      maxSalary: 15,
      category: "Backend Development"
    },
    {
      title: "Full Stack Developer",
      company: "InnovateTech",
      location: "Pune",
      salary: "₹12-16 LPA",
      type: "Full-time",
      experience: "2-5 years",
      description: "Work on end-to-end web application development. Build both frontend and backend components using modern tech stack.",
      requirements: ["React", "Node.js", "MongoDB", "TypeScript", "Docker", "Git"],
      isOnCampus: false,
      urgent: false,
      rating: 4.4,
      employees: "200+",
      source: "external",
      applyUrl: "https://innovatetech.com/jobs",
      benefits: ["Health Insurance", "Work From Home", "Learning Budget", "Flexible Hours"],
      minSalary: 12,
      maxSalary: 16,
      category: "Full Stack Development"
    },
    {
      title: "UI/UX Designer",
      company: "DesignStudio",
      location: "Delhi",
      salary: "₹6-10 LPA",
      type: "Full-time",
      experience: "1-3 years",
      description: "Create intuitive and beautiful user interfaces. Work on user research, wireframing, prototyping, and visual design for web and mobile applications.",
      requirements: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "HTML/CSS"],
      isOnCampus: false,
      urgent: false,
      rating: 4.1,
      employees: "100+",
      source: "external",
      applyUrl: "https://designstudio.com/careers",
      benefits: ["Health Insurance", "Creative Freedom", "Latest Tools", "Design Conferences"],
      minSalary: 6,
      maxSalary: 10,
      category: "Design"
    }
  ];

  // Seed on-campus jobs
  console.log('📝 Creating on-campus jobs...');
  for (const jobData of onCampusJobs) {
    try {
      await jobsService.create(jobData);
      console.log(`✅ Created: ${jobData.title} at ${jobData.company}`);
    } catch (error) {
      console.log(`⚠️  Job might already exist: ${jobData.title} at ${jobData.company}`);
    }
  }

  // Seed external jobs
  console.log('📝 Creating external jobs...');
  for (const jobData of externalJobs) {
    try {
      await jobsService.create(jobData);
      console.log(`✅ Created: ${jobData.title} at ${jobData.company}`);
    } catch (error) {
      console.log(`⚠️  Job might already exist: ${jobData.title} at ${jobData.company}`);
    }
  }

  console.log('🎉 Database seeding completed!');
  
  // Try to sync external jobs from APIs
  console.log('🔄 Attempting to sync external jobs from APIs...');
  try {
    await jobsService.syncExternalJobs();
    console.log('✅ External jobs sync completed');
  } catch (error) {
    console.log('⚠️  External API sync failed (API keys may be missing)');
  }

  await app.close();
}

bootstrap().catch(console.error);
