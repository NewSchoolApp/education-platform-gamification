import { Injectable } from '@nestjs/common';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as Sentry from '@sentry/node';
import { S3 } from 'aws-sdk';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  nodeEnv: string = this.configService.get<string>('NODE_ENV');

  databaseHost: string = this.configService.get<string>('DATABASE_HOST');
  databaseName: string = this.configService.get<string>('DATABASE_NAME');
  databasePort: number = this.configService.get<number>('DATABASE_PORT');
  databaseUsername: string = this.configService.get<string>(
    'DATABASE_USERNAME',
  );
  databasePassword: string = this.configService.get<string>(
    'DATABASE_PASSWORD',
  );
  synchronize: boolean = this.configService.get<string>('NODE_ENV') === 'TEST';
  logging: boolean = this.configService.get<string>('NODE_ENV') !== 'TEST';
  runMigrations: boolean =
    this.configService.get<string>('NODE_ENV') !== 'TEST';

  public getSentryConfiguration(): Sentry.NodeOptions {
    return {
      dsn: this.configService.get<string>('SENTRY_URL'),
      tracesSampleRate: 1.0,
      enabled: this.nodeEnv !== 'TEST',
      environment: this.nodeEnv,
      attachStacktrace: true,
    };
  }

  public getDatabaseConfig(): MysqlConnectionOptions {
    return {
      type: 'mysql',
      multipleStatements: true,
      entities: [
        `${path.resolve(
          path.join(__dirname, '..', '..'),
        )}/**/*.entity{.ts,.js}`,
      ],
      migrationsRun: this.runMigrations,
      migrations: [
        `${path.resolve(
          path.join(__dirname, '..', '..'),
        )}/migration/*{.ts,.js}`,
      ],
      migrationsTableName: 'migration',
      cli: {
        migrationsDir: 'src/migration',
      },
      host: this.databaseHost,
      database: this.databaseName,
      port: this.databasePort,
      username: this.databaseUsername,
      password: this.databasePassword,
      synchronize: this.synchronize || false,
      logging: this.logging,
    };
  }
}
