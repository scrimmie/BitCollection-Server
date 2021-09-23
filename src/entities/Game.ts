import { Entity, PrimaryKey, Property, OneToMany, Collection } from "@mikro-orm/core";
import {ObjectType, Field, Int } from 'type-graphql'
import { Post } from './Post'

@ObjectType()
@Entity()
export class Game {
  
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({type: 'date'})
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field(() => String)
  @Property({ type: 'text' })
  name!: string;

  @Field(() => Int)
  @Property()
  igdb_id!: number;

  @Field(() => [Post])
  @OneToMany(() => Post, post => post.game)
  posts = new Collection<Post>(this);
}