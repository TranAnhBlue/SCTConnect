import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrganizationHierarchy1787900000000 implements MigrationInterface {
  name = 'AddOrganizationHierarchy1787900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organizations" ADD "parent_organization_id" uuid`);
    await queryRunner.query(`CREATE INDEX "idx_organizations_parent_id" ON "organizations" ("parent_organization_id")`);
    await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "FK_organizations_parent_id" FOREIGN KEY ("parent_organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "FK_organizations_parent_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_organizations_parent_id"`);
    await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "parent_organization_id"`);
  }
}
