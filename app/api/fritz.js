import { Graph, Auth } from 'fritz-lib';

export async function getToken(base, username, password) {
  const auth = new Auth({
    credentials: {
      base,
      username,
      password,
    },
  });
  return auth.authenticate();
}

export async function getData(base, token) {
  const graph = new Graph(token, {
    credentials: {
      base,
    },
  });
  return graph.getGraph();
}
