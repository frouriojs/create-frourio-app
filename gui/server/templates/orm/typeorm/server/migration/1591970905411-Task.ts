import { MigrationInterface, QueryRunner } from 'typeorm'

export class Task1591970905411 implements MigrationInterface {
  name = 'Task1591970905411'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `task` (`id` int NOT NULL AUTO_INCREMENT, `label` varchar(100) NOT NULL, `done` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `task`')
  }
}
