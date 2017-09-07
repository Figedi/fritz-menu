import { Graph, Auth, Info, common } from 'fritz-lib';

export async function getToken(credentials) {
  const auth = new Auth({ credentials });
  return auth.authenticate(); // returns { token, tokenAt }
}

export async function getData(credentials, { token, tokenAt }) {
  const auth = Auth.byToken({ credentials }, token, tokenAt);
  if (!auth.tokenValid()) {
    throw new common.UnauthorizedError('Unauthorized');
  }
  return new Graph(auth).getGraph();
}

export async function getOS(credentials, { token, tokenAt }) {
  const auth = Auth.byToken({ credentials }, token, tokenAt);
  if (!auth.tokenValid()) {
    throw new common.UnauthorizedError('Unauthorized');
  }
  return new Info(auth).getOS();
}
