import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import AWS from 'aws-sdk';

@Injectable()
export class UserRewardsListener {
  @SqsMessageHandler('startMonthlyRanking', false)
  public async handleMessage(_message: AWS.SQS.Message) {
    console.log('message', _message);
  }
}
