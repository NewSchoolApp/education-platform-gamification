import { MigrationInterface, QueryRunner } from 'typeorm';

export class Achievement1612710258368 implements MigrationInterface {
  name = 'Achievement1612710258368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `badge` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::CompleteCourse', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration', 'CourseReward::CourseNPS', 'UserReward::ShareApp', 'UserReward::TopMonth', 'UserReward::TopYear') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `achievement` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::CompleteCourse', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration', 'CourseReward::CourseNPS', 'UserReward::ShareApp', 'UserReward::TopMonth', 'UserReward::TopYear') NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `achievement` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::CompleteCourse', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration', 'CourseReward::CourseNPS', 'UserReward::ShareApp', 'UserReward::TopMonth') CHARACTER SET \"latin1\" COLLATE \"latin1_swedish_ci\" NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `badge` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::CompleteCourse', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration', 'CourseReward::CourseNPS', 'UserReward::ShareApp', 'UserReward::TopMonth') CHARACTER SET \"latin1\" COLLATE \"latin1_swedish_ci\" NOT NULL",
    );
  }
}
