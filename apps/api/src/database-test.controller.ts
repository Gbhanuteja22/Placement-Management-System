import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('db-test')
export class DatabaseTestController {
  constructor(@InjectConnection() private connection: Connection) {}

  @Get('status')
  async getDatabaseStatus() {
    try {
      const state = this.connection.readyState;
      const stateMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
      };

      return {
        status: 'success',
        mongoState: stateMap[state] || 'unknown',
        mongoStateCode: state,
        databaseName: this.connection.db?.databaseName,
        host: this.connection.host,
        port: this.connection.port,
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
      };
    }
  }
}
