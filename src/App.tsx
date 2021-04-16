import React, { useState } from "react";
import { AppBar, createMuiTheme, ThemeProvider } from "@material-ui/core";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import "./App.css";
import MainScreen from "./components/MainScreen";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
  credentials: "include",
});

function App() {
  const theme = createMuiTheme();
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <MainScreen />
      </ApolloProvider>
    </ThemeProvider>
  );
}

export default App;
