import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Components/Login';
import Teacher from './Components/Teacher';
import './index.css';

import {
  Routes, Route, Navigate
} from 'react-router-dom'

import {
  useQuery,
  gql
} from "@apollo/client"

function LoginRequired(props){
  const GET_LOGGED_USER = gql`
    {
      getLoggedUser
    }
  `;

  const {data, error} = useQuery(GET_LOGGED_USER)

  if(data){
    return props.children
  }
  if(error) return <Navigate to="/login" replace />

  return <b>Waiting</b>
}

function Announce(){
  const {data, error} = useQuery(gql`
    {
      getLoggedUser
    }
    `)

    if(data) return <b>{data.getLoggedUser}</b>

    return <b>Error</b>
}

export default function App() {
    return(
      <Routes>
        <Route exact path="/" element={<Announce />} />
        <Route path="/my/*" element={<LoginRequired><Teacher /></LoginRequired>}></Route>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<b>404 Not found</b>} />
      </Routes>
    )
}
