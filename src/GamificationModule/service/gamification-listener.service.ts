import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import AWS from 'aws-sdk';
import { UserRewardsService } from './user-rewards.service';

@Injectable()
export class GamificationListenerService {
  constructor(private readonly userRewards: UserRewardsService) {}

  @SqsMessageHandler(process.env.START_MONTHLY_RANKING_QUEUE_URL, false)
  public async handleMessage(_message: AWS.SQS.Message) {
    await this.userRewards.topRankingMonthlyReward();
  }
}
