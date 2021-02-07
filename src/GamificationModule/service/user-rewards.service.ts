import { Injectable } from '@nestjs/common';
import { AchievementRepository } from '../repository/achievement.repository';
import { EventNameEnum } from '../enum/event-name.enum';
import { BadgeRepository } from '../repository/badge.repository';
import { OrderEnum } from '../../CommonsModule/enum/order.enum';
import { TimeRangeEnum } from '../enum/time-range.enum';
import { RankingQueryDTO } from '../dto/ranking-query.dto';

@Injectable()
export class UserRewardsService {
  constructor(
    private readonly achievementRepository: AchievementRepository,
    private readonly badgeRepository: BadgeRepository,
  ) {}

  public async topRankingMonthlyReward() {
    const alreadyRanTopRankingThisMonth = await this.alreadyRanTopRankingLastMonth();
    if (alreadyRanTopRankingThisMonth) return;

    const [
      user,
    ]: RankingQueryDTO[] = await this.achievementRepository.getLastTimeRangeRanking(
      OrderEnum.DESC,
      TimeRangeEnum.MONTH,
      1,
    );

    if (!user) return;

    const badge = await this.badgeRepository.findByEventNameAndOrder(
      EventNameEnum.USER_REWARD_TOP_MONTH,
      1,
    );

    await this.achievementRepository.save({
      eventName: EventNameEnum.USER_REWARD_TOP_MONTH,
      badge,
      userId: user.userId,
      rule: {
        month: new Date().getMonth() === 0 ? 12 : new Date().getMonth() + 1,
        year:
          new Date().getMonth() === 0
            ? new Date().getFullYear() - 1
            : new Date().getFullYear(),
      },
      completed: true,
      points: badge.points,
    });
  }

  public async topRankingAnnualReward() {
    const alreadyRanTopRankingThisYear = await this.alreadyRanTopRankingLastYear();
    if (alreadyRanTopRankingThisYear) return;

    const users: RankingQueryDTO[] = await this.achievementRepository.getLastTimeRangeRanking(
      OrderEnum.DESC,
      TimeRangeEnum.YEAR,
      10,
    );

    if (!users.length) return;

    const badge = await this.badgeRepository.findByEventNameAndOrder(
      EventNameEnum.USER_REWARD_TOP_YEAR,
      1,
    );

    for (const user of users) {
      await this.achievementRepository.save({
        eventName: EventNameEnum.USER_REWARD_TOP_YEAR,
        badge,
        userId: user.userId,
        rule: {
          year: new Date().getFullYear() - 1,
        },
        completed: true,
        points: badge.points,
      });
    }
  }

  private async alreadyRanTopRankingLastMonth(): Promise<boolean> {
    const response = await this.achievementRepository.checkIfHasTopRankForLastMonth();
    return response.length > 0;
  }

  private async alreadyRanTopRankingLastYear(): Promise<boolean> {
    const response = await this.achievementRepository.checkIfHasTopRankForLastYear();
    return response.length > 0;
  }
}
