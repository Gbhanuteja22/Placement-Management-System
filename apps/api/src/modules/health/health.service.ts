import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { RedisService } from '../../common/services/redis.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async check() {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    const [database, redis] = checks;

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      services: {
        database: {
          status: database.status === 'fulfilled' ? 'healthy' : 'unhealthy',
          message: database.status === 'rejected' ? database.reason?.message : 'Connected',
        },
        redis: {
          status: redis.status === 'fulfilled' ? 'healthy' : 'unhealthy',
          message: redis.status === 'rejected' ? redis.reason?.message : 'Connected',
        },
      },
    };
  }

  async ready() {
    try {
      await this.checkDatabase();
      await this.checkRedis();
      return { status: 'ready' };
    } catch (error) {
      throw new Error('Service not ready');
    }
  }

  async live() {
    return {
      status: 'live',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  private async checkDatabase() {
    await this.prisma.$queryRaw`SELECT 1`;
  }

  private async checkRedis() {
    await this.redis.ping();
  }
}
