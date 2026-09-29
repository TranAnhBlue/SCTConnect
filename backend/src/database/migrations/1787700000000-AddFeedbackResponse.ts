import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFeedbackResponse1787700000000 implements MigrationInterface {
  name = 'AddFeedbackResponse1787700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "feedbacks" ADD "response_content" text`);
    await queryRunner.query(`ALTER TABLE "feedbacks" ADD "responded_by_name" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "feedbacks" ADD "responded_at" TIMESTAMP WITH TIME ZONE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "feedbacks" DROP COLUMN "responded_at"`);
    await queryRunner.query(`ALTER TABLE "feedbacks" DROP COLUMN "responded_by_name"`);
    await queryRunner.query(`ALTER TABLE "feedbacks" DROP COLUMN "response_content"`);
  }
}
