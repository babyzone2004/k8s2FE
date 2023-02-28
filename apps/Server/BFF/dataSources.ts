import { ApolloError } from 'apollo-server-errors';
import {
  RESTDataSource,
  RequestOptions,
  Request,
  Response
} from 'apollo-datasource-rest';
import { Score, Ranks } from './typeDefs';

class BaseAPI extends RESTDataSource {
  constructor () {
    super();
    this.baseURL = process.env.BASE_HOST_API;
  }

  override willSendRequest (request: RequestOptions) {
    // request.headers.set('Authorization', 'this.context.token');
  }

  override async didReceiveResponse (response: Response, request: Request) {
    const res = await super.didReceiveResponse(response, request);
    console.log('res', res);
    switch (res.code) {
      case 200:
        return res;
      default:
        throw new ApolloError(res.message, res.code, res);
    }
  }

  async getScore(userId: string): Promise<Score> {
    let res = await this.get('score/' + userId);
    console.log('res', res);
    res = res.data;
    // 此处对res进行数据格式化
    // ...
    return res
  }
  
}

class RankApi extends BaseAPI{
  constructor () {
    super();
    this.baseURL = process.env.RANK_API;
  }
  async getRank(): Promise<Ranks> {
    let res = await this.get('');
    console.log('res', res);
    res = res.data;
    // 此处对res进行数据格式化
    let arr = {
      ranks: []
    };
    res.forEach((elem) => {
      arr.ranks.push({
        id: elem._id,
        value: elem.rating,
        userId: '0'
      });
    });
    console.log('arr', arr);
    return arr;
  }
}

export interface Context {
  dataSources: {
    baseApi: BaseAPI,
    rankApi: RankApi
  };
}

export default function () {
  return {
    baseApi: new BaseAPI(),
    rankApi: new RankApi()
  };
}