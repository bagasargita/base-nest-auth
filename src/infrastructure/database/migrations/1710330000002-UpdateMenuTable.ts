import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMenuTable1710330000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing foreign key constraints if they exist
    await queryRunner.query(`
      ALTER TABLE "menus" 
      DROP CONSTRAINT IF EXISTS "FK_00ccc1ed4e9fc23bc1246269359"
    `);

    // Drop existing unique constraints if they exist
    await queryRunner.query(`
      ALTER TABLE "menus" 
      DROP CONSTRAINT IF EXISTS "UQ_menus_path"
    `);

    // Modify columns
    await queryRunner.query(`
      ALTER TABLE "menus"
      ALTER COLUMN "icon" TYPE varchar,
      ALTER COLUMN "icon" DROP NOT NULL,
      ALTER COLUMN "parent_id" TYPE integer,
      ALTER COLUMN "parent_id" DROP NOT NULL
    `);

    // Add foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "menus"
      ADD CONSTRAINT "FK_00ccc1ed4e9fc23bc1246269359"
      FOREIGN KEY ("parent_id")
      REFERENCES "menus"("id")
      ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "menus"
      DROP CONSTRAINT IF EXISTS "FK_00ccc1ed4e9fc23bc1246269359"
    `);

    // Revert column modifications
    await queryRunner.query(`
      ALTER TABLE "menus"
      ALTER COLUMN "icon" TYPE varchar,
      ALTER COLUMN "icon" SET NOT NULL,
      ALTER COLUMN "parent_id" TYPE integer,
      ALTER COLUMN "parent_id" SET NOT NULL
    `);

    // Add back unique constraint
    await queryRunner.query(`
      ALTER TABLE "menus"
      ADD CONSTRAINT "UQ_menus_path"
      UNIQUE ("path")
    `);
  }
}