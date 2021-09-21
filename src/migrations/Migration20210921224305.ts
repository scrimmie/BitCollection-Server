import { Migration } from '@mikro-orm/migrations';

export class Migration20210921224305 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "game" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "igdb_id" varchar(255) not null);');

    this.addSql('create table "platform" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "platform_name" text not null, "owner_id" int4 not null, "game_id" int4 not null);');

    this.addSql('alter table "post" rename column "title" to "content";');


    this.addSql('alter table "post" add column "author_id" int4 not null, add column "game_id" int4 not null;');

    this.addSql('alter table "platform" add constraint "platform_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "platform" add constraint "platform_game_id_foreign" foreign key ("game_id") references "game" ("id") on update cascade;');

    this.addSql('alter table "post" add constraint "post_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "post" add constraint "post_game_id_foreign" foreign key ("game_id") references "game" ("id") on update cascade;');
  }

}
