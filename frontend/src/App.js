import React from "react";
import "./App.css";
import Header from "./components/Header";
import { ApolloProvider } from "@apollo/react-hooks";
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";

// Setting up web socket
const httpLink = new HttpLink({
  uri: "https://kanban-backend-ajay.herokuapp.com/graphql",
});

const wsLink = new WebSocketLink({
  uri: "wss://kanban-backend-ajay.herokuapp.com/graphql",
  options: {
    reconnect: true,
  },
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App" style={{ height: "100vh" }}>
        <Header />
      </div>
    </ApolloProvider>
  );
}

export default App;
