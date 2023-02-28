import { Resolver, Query, Ctx, Args, Arg, Mutation } from 'type-graphql';
import { Score, Ranks } from './typeDefs';
import type { Context } from './dataSources';

@Resolver(() => Score)
export class ScoreResolver {
  @Query(() => Score)
  async score(@Arg("userId") userId: string, @Ctx() context: Context): Promise<Score | undefined> {
    return await context.dataSources.baseApi.getScore(userId);
  }
}
@Resolver(() => Ranks)
export class RanksResolver {
  @Query(() => Ranks)
  async ranks(@Ctx() context: Context): Promise<Ranks | undefined> {
    return await context.dataSources.rankApi.getRank();
  }
}

export default [ScoreResolver, RanksResolver] as const;