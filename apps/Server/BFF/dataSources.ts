import { ApolloError } from 'apollo-server-errors';
import {
  RESTDataSource,
  RequestOptions,
  Request,
  Response
} from 'apollo-datasource-rest';
import { Score } from './typeDefs';

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
    let res = await this.get('user', 'userId=' + userId);
    console.log('res', res);
    res = res.data;
    // 此处对res进行数据格式化
    // ...
    return res
  }
}

export interface Context {
  dataSources: {
    baseApi: BaseAPI;
  };
}

export default function () {
  return {
    baseApi: new BaseAPI()
  };
}