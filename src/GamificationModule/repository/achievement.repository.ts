import { EntityRepository, Repository } from 'typeorm';
import { Achievement } from '../entity/achievement.entity';
import { EventNameEnum } from '../enum/event-name.enum';
import { OrderEnum } from '../../CommonsModule/enum/order.enum';
import { TimeRangeEnum } from '../enum/time-range.enum';
import { RankingDTO } from '../dto/ranking.dto';
import { RankingQueryDTO } from '../dto/ranking-query.dto';
import * as mysql from 'mysql2';

@EntityRepository(Achievement)
export class AchievementRepository extends Repository<Achievement> {
  public async getLastTimeRangeRanking(
    order: OrderEnum,
    timeRange: TimeRangeEnum,
    limit: number,
  ): Promise<RankingQueryDTO[]> {
    const timeRangeMethod =
      timeRange === TimeRangeEnum.MONTH ? 'MONTH' : 'YEAR';
    const timeRangeQuery = `
      AND ${timeRangeMethod}(a2.updatedAt) = ${timeRangeMethod}(CURRENT_DATE() - INTERVAL 1 ${timeRangeMethod})
    `;
    const limitQuery = `LIMIT ${mysql.escape(limit)}`;

    const derivedTable = `
    SELECT c2.id as 'userId', c2.name as 'userName', c2.photoPath as 'photoPath', SUM(b2.points) as 'points' FROM achievement a2
      inner join badge b2
      on a2.badgeId = b2.id
      inner join user c2
      on a2.userId = c2.id
      WHERE a2.completed = 1 ${timeRangeQuery}
      GROUP by a2.userId
      ${limitQuery}
    `;

    return this.query(
      `
    SELECT
      t.userId,
      t.userName,
      t.photoPath,
      t.points,
      1 + (
        SELECT
          count( * )
        FROM
          (${derivedTable})
        AS
          t2
        WHERE
          t2.points > t.points
      )
    AS
      rank
    FROM
      (${derivedTable})
    AS t ORDER BY t.points ${order}
    `,
    );
  }

  public checkIfHasTopRankForLastMonth(): Promise<any[]> {
    const lastTopMonthRankMonth =
      new Date().getMonth() === 0 ? 12 : new Date().getMonth() + 1;
    const lastTopMonthRankYear =
      new Date().getMonth() === 0
        ? new Date().getFullYear() - 1
        : new Date().getFullYear();
    return this.query(
      `
      SELECT
        *
      FROM
        achievement a
      WHERE
        eventName = ?
      AND
        a.completed = 1
      AND
        rule->>"$.month" = ?
      AND
        rule->>"$.year" = ?
    `,
      [
        EventNameEnum.USER_REWARD_TOP_MONTH,
        lastTopMonthRankMonth,
        lastTopMonthRankYear,
      ],
    );
  }

  public checkIfHasTopRankForLastYear(): Promise<any[]> {
    const lastTopMonthRankYear = new Date().getFullYear() - 1;
    return this.query(
      `
      SELECT
        *
      FROM
        achievement a
      WHERE
        eventName = ?
      AND
        a.completed = 1
      AND
        rule->>"$.year" = ?
    `,
      [EventNameEnum.USER_REWARD_TOP_YEAR, lastTopMonthRankYear],
    );
  }
}
