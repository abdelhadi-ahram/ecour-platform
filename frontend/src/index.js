import React from 'react';
import ReactDOM from 'react-dom';

import App from './App.js';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql

} from "@apollo/client";

const client = new ApolloClient({
  uri: '127.0.0.1:8000/graphql',
  cache: new InMemoryCache()
});




ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.querySelector('#root')
)
