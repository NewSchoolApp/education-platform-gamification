import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@ssut/nestjs-sqs';
import { UserRewardsService } from './service/user-rewards.service';
import { Achievement } from './entity/achievement.entity';
import { BadgeRepository } from './repository/badge.repository';
import { Badge } from './entity/badge.entity';
import { AchievementRepository } from './repository/achievement.repository';
import { UserRewardsListener } from './listener/user-rewards.listener';
import * as AWS from 'aws-sdk';

const SQS = new AWS.SQS({ apiVersion: '2012-11-05', region: 'us-east-2' });

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      AchievementRepository,
      Badge,
      BadgeRepository,
    ]),
    SqsModule.register({
      consumers: [
        {
          name: 'startMonthlyRanking',
          queueUrl: process.env.START_MONTHLY_RANKING_QUEUE_URL,
          sqs: SQS, // instance of new AWS.SQS
          waitTimeSeconds: 1,
          batchSize: 1,
          terminateVisibilityTimeout: true,
          messageAttributeNames: ['All'],
        },
      ],
      producers: [],
    }),
  ],
  controllers: [],
  providers: [UserRewardsListener, UserRewardsService],
})
export class GamificationModule {}
