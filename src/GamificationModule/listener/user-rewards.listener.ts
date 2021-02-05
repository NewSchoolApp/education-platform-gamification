import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { UserRewardsService } from '../service/user-rewards.service';

@Injectable()
export class UserRewardsListener {
  constructor(private readonly service: UserRewardsService) {}

  @SqsMessageHandler('startMonthlyRanking', false)
  public async handleMessage() {
    await this.service.topRankingMonthlyReward();
  }
}
