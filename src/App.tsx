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

type NotificationData = {
  newNotification: {
    name: string;
    desc?: string;
    info?: string;
  };
};

// const TEST_SUBSCRIBE = gql`
//   subscription($userId: String!) {
//     newNotification(topic: $userId) {
//       name
//     }
//   }
// `;

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  credentials: "include",
});

export const UserStateContext = createContext<AppInterfaces.IUserState>({
  userId: "-1",
  setUserId: (s: string) => {},
});

function App() {
  const theme = createMuiTheme();
  const [userId, setUserId] = useState("");
  // const [test, setTest] = useState(false);
  // const { loading, error, data: subData } = useSubscription<NotificationData>(
  //   TEST_SUBSCRIBE,
  //   { variables: { userId }, client, shouldResubscribe: test }
  // );
  // useEffect(() => {
  //   console.log(userId);
  //   console.log(client.cache);
  //   setTest(true);
  // }, [userId]);
  // useEffect(() => {
  //   console.log(subData);
  //   setTest(false);
  // }, [subData]);
  return (
    <ThemeProvider theme={theme}>
      <UserStateContext.Provider value={{ userId, setUserId }}>
        <ApolloProvider client={client}>
          <MainScreen />
        </ApolloProvider>
      </UserStateContext.Provider>
    </ThemeProvider>
  );
}

export default App;
