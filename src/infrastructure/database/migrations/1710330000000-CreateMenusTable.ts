import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateMenusTable1710330000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if table exists
    const tableExists = await queryRunner.hasTable('menus');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'menus',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'name',
              type: 'varchar',
            },
            {
              name: 'path',
              type: 'varchar',
              isUnique: true,
            },
            {
              name: 'icon',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'parent_id',
              type: 'int',
              isNullable: true,
            },
            {
              name: 'order',
              type: 'int',
              default: 0,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
        true,
      );
    }

    // Check if foreign key exists
    const table = await queryRunner.getTable('menus');
    if (table) {
      const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('parent_id') !== -1);
      if (!foreignKey) {
        await queryRunner.createForeignKey(
          'menus',
          new TableForeignKey({
            columnNames: ['parent_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'menus',
            onDelete: 'SET NULL',
          }),
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('menus');
    if (table) {
      const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('parent_id') !== -1);
      if (foreignKey) {
        await queryRunner.dropForeignKey('menus', foreignKey);
      }
    }
    await queryRunner.dropTable('menus');
  }
} 