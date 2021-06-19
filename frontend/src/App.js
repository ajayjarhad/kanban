import React from 'react';
import Board from './components/Board/Board';
import { ApolloProvider } from '@apollo/react-hooks';
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { WebSocketLink } from "apollo-link-ws";
import logo from './logo.svg';
import './App.css';


const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});
const wsLink = new WebSocketLink({
  uri: "ws://localhost:4444/graphql",
  options: {
    reconnect: true,
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind == "OperationDefinition" && operation == "subscription";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

function App() {
  return
}

export default App;
