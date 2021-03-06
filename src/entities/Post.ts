import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import {ObjectType, Field, Int } from 'type-graphql'
import { User } from './User'
import { Game } from './Game'

@ObjectType()
@Entity()
export class Post {
  
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
  content!: string;

  @Field(() => Int)
  @Property()
  likes!: number;

  @Field(() => User)
  @ManyToOne()
  author!: User;

  @Field(() => Game)
  @ManyToOne()
  game!: Game;
}