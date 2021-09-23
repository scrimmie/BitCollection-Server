import { Migration } from '@mikro-orm/migrations';

export class Migration20210923220656 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "game" drop constraint if exists "game_igdb_id_check";');
    this.addSql('alter table "game" alter column "igdb_id" type int4 using ("igdb_id"::int4);');
  }

}
