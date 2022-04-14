import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Components/Login';
import Teacher from './Components/Teacher';
import Student from './Components/Student';
import LandingPage from './Components/LandingPage'

//https://dribbble.com/shots/17399694-Search-Results-Animation

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


function AlreadyLoggedin(props){
  const GET_LOGGED_USER = gql`
    {
      getLoggedUser{
        firstName 
        role
        isAuthenticated
      }
    }
  `;

  const {data, error} = useQuery(GET_LOGGED_USER)

  if(data){
    return <Navigate to="/my/home" replace />
  }

  if(error) return props.children

  return <LoadingPage />
}

export default function App() {
    return(
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route path="/my/*" element={<LoginRequired></LoginRequired>}></Route>
        <Route path="/login" element={<AlreadyLoggedin><Login /></AlreadyLoggedin>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
}
