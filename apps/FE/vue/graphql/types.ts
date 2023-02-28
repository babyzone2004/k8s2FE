import gql from "graphql-tag";
import * as VueApolloComposable from "@vue/apollo-composable";
import * as VueCompositionApi from "vue";
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type ReactiveFunction<TParam> = () => TParam;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  ranks: Ranks;
  score: Score;
};

export type QueryScoreArgs = {
  userId: Scalars["String"];
};

export type Ranks = {
  ranks: Array<Score>;
};

export type Score = {
  id: Scalars["String"];
  userId: Scalars["String"];
  value: Scalars["Float"];
};

export type ScoreQueryVariables = Exact<{
  userId: Scalars["String"];
}>;

export type ScoreQuery = { score: { value: number } };

export type RanksQueryVariables = Exact<{ [key: string]: never }>;

export type RanksQuery = {
  ranks: { ranks: Array<{ id: string; value: number }> };
};

export const ScoreDocument = gql`
  query score($userId: String!) {
    score(userId: $userId) {
      value
    }
  }
`;

/**
 * __useScoreQuery__
 *
 * To run a query within a Vue component, call `useScoreQuery` and pass it any options that fit your needs.
 * When your component renders, `useScoreQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useScoreQuery({
 *   userId: // value for 'userId'
 * });
 */
export function useScoreQuery(
  variables:
    | ScoreQueryVariables
    | VueCompositionApi.Ref<ScoreQueryVariables>
    | ReactiveFunction<ScoreQueryVariables>,
  options:
    | VueApolloComposable.UseQueryOptions<ScoreQuery, ScoreQueryVariables>
    | VueCompositionApi.Ref<
        VueApolloComposable.UseQueryOptions<ScoreQuery, ScoreQueryVariables>
      >
    | ReactiveFunction<
        VueApolloComposable.UseQueryOptions<ScoreQuery, ScoreQueryVariables>
      > = {}
) {
  return VueApolloComposable.useQuery<ScoreQuery, ScoreQueryVariables>(
    ScoreDocument,
    variables,
    options
  );
}
export function useScoreLazyQuery(
  variables:
    | ScoreQueryVariables
    | VueCompositionApi.Ref<ScoreQueryVariables>
    | ReactiveFunction<ScoreQueryVariables>,
  options:
    | VueApolloComposable.UseQueryOptions<ScoreQuery, ScoreQueryVariables>
    | VueCompositionApi.Ref<
        VueApolloComposable.UseQueryOptions<ScoreQuery, ScoreQueryVariables>
      >
    | ReactiveFunction<
        VueApolloComposable.UseQueryOptions<ScoreQuery, ScoreQueryVariables>
      > = {}
) {
  return VueApolloComposable.useLazyQuery<ScoreQuery, ScoreQueryVariables>(
    ScoreDocument,
    variables,
    options
  );
}
export type ScoreQueryCompositionFunctionResult =
  VueApolloComposable.UseQueryReturn<ScoreQuery, ScoreQueryVariables>;
export const RanksDocument = gql`
  query ranks {
    ranks {
      ranks {
        id
        value
      }
    }
  }
`;

/**
 * __useRanksQuery__
 *
 * To run a query within a Vue component, call `useRanksQuery` and pass it any options that fit your needs.
 * When your component renders, `useRanksQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useRanksQuery();
 */
export function useRanksQuery(
  options:
    | VueApolloComposable.UseQueryOptions<RanksQuery, RanksQueryVariables>
    | VueCompositionApi.Ref<
        VueApolloComposable.UseQueryOptions<RanksQuery, RanksQueryVariables>
      >
    | ReactiveFunction<
        VueApolloComposable.UseQueryOptions<RanksQuery, RanksQueryVariables>
      > = {}
) {
  return VueApolloComposable.useQuery<RanksQuery, RanksQueryVariables>(
    RanksDocument,
    {},
    options
  );
}
export function useRanksLazyQuery(
  options:
    | VueApolloComposable.UseQueryOptions<RanksQuery, RanksQueryVariables>
    | VueCompositionApi.Ref<
        VueApolloComposable.UseQueryOptions<RanksQuery, RanksQueryVariables>
      >
    | ReactiveFunction<
        VueApolloComposable.UseQueryOptions<RanksQuery, RanksQueryVariables>
      > = {}
) {
  return VueApolloComposable.useLazyQuery<RanksQuery, RanksQueryVariables>(
    RanksDocument,
    {},
    options
  );
}
export type RanksQueryCompositionFunctionResult =
  VueApolloComposable.UseQueryReturn<RanksQuery, RanksQueryVariables>;
