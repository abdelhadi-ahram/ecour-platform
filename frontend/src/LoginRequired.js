import React from "react"
import {
  Routes, Route, Navigate
} from 'react-router-dom'

import UserProvider from "./UserProvider"

import {LoadingPage} from "./Components/Loadings";

import {
  useQuery,
  gql
} from "@apollo/client"

import Student from "./Components/Student"
import Teacher from "./Components/Teacher"

function LoginRequired(props){
  const GET_LOGGED_USER = gql`
    {
      getLoggedUser {
        firstName
        role
      }
    }
  `;

  const {data, error} = useQuery(GET_LOGGED_USER)

  if(data){
    if(props.children){
      return props.children
    }

    if(data.getLoggedUser.role == "student") return (
      <UserProvider.Provider value={data.getLoggedUser.firstName}>
        <Student />
      </UserProvider.Provider>)

    if(data.getLoggedUser.role == "teacher") return (
      <UserProvider.Provider value={data.getLoggedUser.firstName}>
        <Teacher />
      </UserProvider.Provider>)
  }

  if(error){
    return <Navigate to="/login" replace />
  } 

  return <LoadingPage />
}


export default LoginRequired;