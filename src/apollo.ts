import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "@apollo/client/link/ws";
import { LOCALSTORAGE_TOKEN } from "./constants";
import { getMainDefinition } from "@apollo/client/utilities";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

// 웹소켓 링크 추가하기
const wsLink = new WebSocketLink(
  new SubscriptionClient(
    process.env.NODE_ENV === "production"
      ? "wss://nuber-eats-backend-camelcrush.herokuapp.com/graphql"
      : `ws://localhost:4000/graphql`,
    {
      reconnect: true,
      connectionParams: {
        "x-jwt": authTokenVar() || "",
      },
    }
  )
);
// http 링크 추가하기
const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://nuber-eats-backend-camelcrush.herokuapp.com/graphql"
      : "http://localhost:4000/graphql",
});
// auth 링크 추가하기
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVar() || "",
    },
  };
});

// split 링크 추가하기
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedInVar: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
