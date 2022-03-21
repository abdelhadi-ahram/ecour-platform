import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App"

import {BrowserRouter} from "react-router-dom"

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from "@apollo/client";


const link = createHttpLink({
  uri: 'http://127.0.0.1:8000/graphql',
  credentials: 'include'
});


const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.querySelector('#root')
)
