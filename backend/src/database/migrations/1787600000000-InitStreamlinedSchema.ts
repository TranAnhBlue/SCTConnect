import { MigrationInterface, QueryRunner } from "typeorm";

export class InitStreamlinedSchema1787600000000 implements MigrationInterface {
    name = 'InitStreamlinedSchema1787600000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.query(`
            CREATE TABLE "villages" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "code" character varying(50) NOT NULL,
                "name" character varying(100) NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_villages_code" UNIQUE ("code"),
                CONSTRAINT "PK_villages_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_villages_code" ON "villages" ("code")`);

        await queryRunner.query(`
            CREATE TABLE "organizations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "code" character varying(50) NOT NULL,
                "name" character varying(255) NOT NULL,
                "type" character varying(50) NOT NULL DEFAULT 'union',
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_organizations_code" UNIQUE ("code"),
                CONSTRAINT "PK_organizations_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_organizations_code" ON "organizations" ("code")`);

        await queryRunner.query(`
            CREATE TABLE "feedback_categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "code" character varying(50) NOT NULL,
                "name" character varying(255) NOT NULL,
                "description" text,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_feedback_categories_code" UNIQUE ("code"),
                CONSTRAINT "PK_feedback_categories_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_feedback_categories_code" ON "feedback_categories" ("code")`);

        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "phone" character varying(20) NOT NULL,
                "full_name" character varying(255) NOT NULL,
                "village_id" uuid,
                "password_hash" text NOT NULL,
                "user_type" character varying(30) NOT NULL DEFAULT 'citizen',
                "organization_id" uuid,
                "is_active" boolean NOT NULL DEFAULT true,
                "last_login_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_phone" UNIQUE ("phone"),
                CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_users_phone" ON "users" ("phone")`);
        await queryRunner.query(`CREATE INDEX "idx_users_village_id" ON "users" ("village_id")`);
        await queryRunner.query(`CREATE INDEX "idx_users_org_id" ON "users" ("organization_id")`);

        await queryRunner.query(`
            CREATE TABLE "feedbacks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "code" character varying(50) NOT NULL,
                "user_id" uuid NOT NULL,
                "target_organization_id" uuid NOT NULL,
                "incident_village_id" uuid NOT NULL,
                "category_id" uuid NOT NULL,
                "address" text,
                "title" character varying(255) NOT NULL,
                "content" text NOT NULL,
                "status" character varying(30) NOT NULL DEFAULT 'pending',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_feedbacks_code" UNIQUE ("code"),
                CONSTRAINT "PK_feedbacks_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_feedbacks_code" ON "feedbacks" ("code")`);
        await queryRunner.query(`CREATE INDEX "idx_feedbacks_user_id" ON "feedbacks" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "idx_feedbacks_target_org_id" ON "feedbacks" ("target_organization_id")`);
        await queryRunner.query(`CREATE INDEX "idx_feedbacks_incident_village_id" ON "feedbacks" ("incident_village_id")`);
        await queryRunner.query(`CREATE INDEX "idx_feedbacks_category_id" ON "feedbacks" ("category_id")`);
        await queryRunner.query(`CREATE INDEX "idx_feedbacks_status" ON "feedbacks" ("status")`);

        await queryRunner.query(`
            CREATE TABLE "feedback_attachments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "feedback_id" uuid NOT NULL,
                "file_url" text NOT NULL,
                "file_type" character varying(50) NOT NULL DEFAULT 'image/jpeg',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_feedback_attachments_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_feedback_attachments_feedback_id" ON "feedback_attachments" ("feedback_id")`);

        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD CONSTRAINT "FK_users_village_id" 
            FOREIGN KEY ("village_id") REFERENCES "villages"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD CONSTRAINT "FK_users_organization_id" 
            FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "feedbacks" 
            ADD CONSTRAINT "FK_feedbacks_user_id" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "feedbacks" 
            ADD CONSTRAINT "FK_feedbacks_target_org_id" 
            FOREIGN KEY ("target_organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "feedbacks" 
            ADD CONSTRAINT "FK_feedbacks_incident_village_id" 
            FOREIGN KEY ("incident_village_id") REFERENCES "villages"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "feedbacks" 
            ADD CONSTRAINT "FK_feedbacks_category_id" 
            FOREIGN KEY ("category_id") REFERENCES "feedback_categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "feedback_attachments" 
            ADD CONSTRAINT "FK_feedback_attachments_feedback_id" 
            FOREIGN KEY ("feedback_id") REFERENCES "feedbacks"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(
            `INSERT INTO "users" (
                "phone",
                "full_name",
                "password_hash",
                "user_type",
                "village_id",
                "organization_id",
                "is_active"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                '0988888888',
                'Quản Trị Viên Kỹ Thuật (Admin IT)',
                '$argon2id$v=19$m=65536,p=4,t=3$ssN/KKv88HxEWUA9Jfh/3g$b3z1XNHnNoNQNlRnkXhmCaHCxU36AJSEbrgiwZ1xczw',
                'admin',
                null,
                null,
                true,
            ],
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback_attachments" DROP CONSTRAINT "FK_feedback_attachments_feedback_id"`);
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP CONSTRAINT "FK_feedbacks_category_id"`);
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP CONSTRAINT "FK_feedbacks_incident_village_id"`);
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP CONSTRAINT "FK_feedbacks_target_org_id"`);
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP CONSTRAINT "FK_feedbacks_user_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_organization_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_village_id"`);

        await queryRunner.query(`DROP INDEX "public"."idx_feedback_attachments_feedback_id"`);
        await queryRunner.query(`DROP TABLE "feedback_attachments"`);

        await queryRunner.query(`DROP INDEX "public"."idx_feedbacks_status"`);
        await queryRunner.query(`DROP INDEX "public"."idx_feedbacks_category_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_feedbacks_incident_village_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_feedbacks_target_org_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_feedbacks_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_feedbacks_code"`);
        await queryRunner.query(`DROP TABLE "feedbacks"`);

        await queryRunner.query(`DROP INDEX "public"."idx_users_org_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_users_village_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_users_phone"`);
        await queryRunner.query(`DROP TABLE "users"`);

        await queryRunner.query(`DROP INDEX "public"."idx_feedback_categories_code"`);
        await queryRunner.query(`DROP TABLE "feedback_categories"`);

        await queryRunner.query(`DROP INDEX "public"."idx_organizations_code"`);
        await queryRunner.query(`DROP TABLE "organizations"`);

        await queryRunner.query(`DROP INDEX "public"."idx_villages_code"`);
        await queryRunner.query(`DROP TABLE "villages"`);
    }
}
