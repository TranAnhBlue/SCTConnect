import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFeedbackStatusUpdatedAt1787800000000 implements MigrationInterface {
  name = 'AddFeedbackStatusUpdatedAt1787800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "feedbacks" ADD "status_updated_at" TIMESTAMP WITH TIME ZONE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "feedbacks" DROP COLUMN "status_updated_at"`);
  }
}
