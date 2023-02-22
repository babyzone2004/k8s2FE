import { Resolver, Query, Ctx, Args, Arg, Mutation } from 'type-graphql';
import { Score } from './typeDefs';
import type { Context } from './dataSources';

@Resolver(() => Score)
export class ScoreResolver {
  @Query(() => Score)
  async score(@Arg("userId") userId: string, @Ctx() context: Context): Promise<Score | undefined> {
    return await context.dataSources.baseApi.getScore(userId);
  }
}


export default [ScoreResolver] as const;