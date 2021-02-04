import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { GamificationModule } from './GamificationModule/gamification.module';
import { ConfigModule } from './ConfigModule/config.module';
import { AppConfigService as ConfigService } from './ConfigModule/service/app-config.service';

const typeOrmAsyncModule: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (appConfigService: ConfigService) =>
    appConfigService.getDatabaseConfig(),
};

@Module({
  imports: [
    ConfigModule,
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncModule),
    GamificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
