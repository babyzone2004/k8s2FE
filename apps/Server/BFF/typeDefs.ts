import {
    Field,
    ObjectType,
  } from 'type-graphql';
@ObjectType()
export class Score {
  @Field()
  id: string;

  @Field()
  value: number;

  @Field()
  userId: string;
}
@ObjectType()
export class Ranks {
  @Field(() => [Score])
  ranks: Array<typeof Score>;
}