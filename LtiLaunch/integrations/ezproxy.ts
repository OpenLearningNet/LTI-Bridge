import { Context, HttpRequest } from "@azure/functions"
import * as crypto from 'crypto';

const md5 = (contents: string) => crypto.createHash('md5').update(contents).digest("hex");

export const completeLaunch = (config: any) => async function (context: Context, req: HttpRequest, params: any): Promise<void> {
  const userId: string = params.user_id;
  const secret = config.secret;
  const baseUrl = config.baseUrl;
  const packet = `$u${Math.round(Date.now() / 1000)}`;
  const ticket = encodeURIComponent(md5(secret + userId + packet) + packet);
  const redirect = baseUrl + `/login?user=${userId}&ticket=${ticket}`;
  context.res = {
    status: 302,
    body: null,
    headers: {
      location: redirect
    }
  };
  context.done();
}
