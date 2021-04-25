import React, { createContext, useEffect, useState } from "react";
import { AppBar, createMuiTheme, ThemeProvider } from "@material-ui/core";
import {
  ApolloClient,
  ApolloProvider,
  gql,
  HttpLink,
  InMemoryCache,
  split,
  useSubscription,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import "./App.css";
import MainScreen from "./components/MainScreen";
import * as AppInterfaces from "./IApp";

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/sub",
  options: {
    reconnect: true,
  },
});

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  credentials: "include",
});

export const UserStateContext = createContext<AppInterfaces.IUserState>({
  userId: "-1",
  setUserId: (s: string) => {},
});

export type NotificationData = {
  newNotification: {
    name: string;
    desc?: string;
    info?: string;
  };
};

export const SubContext = createContext<AppInterfaces.ISub<NotificationData>>({
  data: undefined,
  error: undefined,
  loading: false,
  variables: undefined,
});

const TEST_SUBSCRIBE = gql`
  subscription($userId: String!) {
    newNotification(topic: $userId) {
      name
    }
  }
`;

function App() {
  const theme = createMuiTheme();
  const [userId, setUserId] = useState("");
  // let {
  //   variables,
  //   loading,
  //   error,
  //   data,
  // }: AppInterfaces.ISub<NotificationData> = {
  //   loading: false,
  //   error: undefined,
  //   data: undefined,
  //   variables: undefined,
  // };
  const { loading, error, data } = useSubscription<NotificationData>(
    TEST_SUBSCRIBE,
    {
      variables: { userId: "1" },
      client,
      shouldResubscribe: true,
      onSubscriptionData: () => {
        console.log("recieved data");
      },
    }
  );
  // const [test, setTest] = useState(false);
  useEffect(() => {
    console.log(userId);
    // console.log(client.cache);
    // setTest(true);
  }, [userId]);
  useEffect(() => {
    console.log("data", data, loading, error);
  }, [data, loading, error]);
  return (
    <ThemeProvider theme={theme}>
      <UserStateContext.Provider value={{ userId, setUserId }}>
        <ApolloProvider client={client}>
          {/* <SubContext.Provider value={{ loading, error, data }}> */}
          <MainScreen />
          {/* </SubContext.Provider> */}
        </ApolloProvider>
      </UserStateContext.Provider>
    </ThemeProvider>
  );
}

export default App;
