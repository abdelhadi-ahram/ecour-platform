import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Components/Login';
import Teacher from './Components/Teacher';
import Student from './Components/Student';

import './index.css';

import LoginRequired from "./LoginRequired"
import {LoadingPage} from "./Components/Loadings"

import {
  Routes, Route, Navigate
} from 'react-router-dom'

import {
  useQuery,
  gql
} from "@apollo/client"


function Announce(){
  const {data, error} = useQuery(gql`
    {
      getLoggedUser
    }
    `)

    if(data) {
      return (
      <b>{data.getLoggedUser}
      </b>)
    }

    return <LoadingPage />
}

function AlreadyLoggedin(props){
  const GET_LOGGED_USER = gql`
    {
      getLoggedUser{
        firstName 
        role
      }
    }
  `;

  const {data, error} = useQuery(GET_LOGGED_USER)

  if(data){
    return <Navigate to="/my" replace />
  }

  if(error) return props.children

  return <LoadingPage />
}

export default function App() {
    return(
      <Routes>
        <Route exact path="/" element={<Announce />} />
        <Route path="/my/*" element={<LoginRequired></LoginRequired>}></Route>
        <Route path="/login" element={<AlreadyLoggedin><Login /></AlreadyLoggedin>} />
        <Route path="*" element={<Navigate to="/my" replace />} />
      </Routes>
    )
}
