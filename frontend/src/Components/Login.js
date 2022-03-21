import React from "react";

import {useNavigate} from "react-router-dom"

import {
  useLazyQuery,
  gql
} from "@apollo/client"


const AUTHENTICATE_USER = gql`
  query AuthenticateUser($email:String!, $password:String!){
    authenticateUser(email: $email, password: $password){
      firstName
    }
  }
`

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const [authenticateUser, {loading, data, error}] = useLazyQuery(AUTHENTICATE_USER)

  function login(){
    authenticateUser({variables : {email, password}})
  }

  if(loading){
    return <p>Loding ....</p>
  }

  if(data){
    navigate("/my")
  }

  if(error){
    alert('Error')
  }

  return(
    <div className="bg-gray-100 flex justify-center items-center content-center w-screen h-screen" >
      <div className="w-[400px]">
        <div className="bg-white shadow-md rounded-2xl px-11 py-14 my-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <div className=" flex items-center border border-gray-300 rounded w-full py-2 px-3 text-gray-700  hover:border-gray-400">
              <input autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-6  focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
            </div>
          </div>

          <div className=" mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" >
              Password
            </label>
            <div className="flex items-center  appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 hover:border-gray-400 ">
                  <input autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full focus:outline-none focus:shadow-outline" id="password" type={showPassword ? "text" : "password"} placeholder="**********" />
                  <span className="text-gray-500" onClick={() => {setShowPassword(!showPassword)}} >
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>            )}
                  </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 ">
                <input type='checkbox' value='Remember me'/>
                <label className="text-gray-500">Remember me</label>
              </div>

              <button onClick={login} className="w-full mt-4 bg-blue-400 hover:bg-blue-400 text-white text-lg my-4 py-2 px-4 rounded-lg border border-white focus:ring-1 focus:ring-blue-400">
                Login
              </button>
              <div className="flex justify-center items-center w-full ">
              <button className=" bg-transparent  text-sky-600 rounded-xl ">
                  Forgot Password?
              </button>
           </div>

        </div>
      </div>
    </div>
  );
}
