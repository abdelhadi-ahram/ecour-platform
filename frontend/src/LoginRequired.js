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
    if(props.children)
      return props.children

    return <b>With no children</b>
  }
  if(error) return <Navigate to="/login" replace />

  return <b>Waiting</b>
}


export default LoginRequired;