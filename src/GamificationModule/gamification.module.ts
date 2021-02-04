import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@ssut/nestjs-sqs';
import { UserRewardsService } from './service/user-rewards.service';
import { Achievement } from './entity/achievement.entity';
import { BadgeRepository } from './repository/badge.repository';
import { Badge } from './entity/badge.entity';
import { AchievementRepository } from './repository/achievement.repository';
import { UserRewardsListener } from './listener/user-rewards.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      AchievementRepository,
      Badge,
      BadgeRepository,
    ]),
    SqsModule.register({
      consumers: [UserRewardsListener],
      producers: [],
    }),
  ],
  controllers: [],
  providers: [UserRewardsService],
})
export class GamificationModule {}
