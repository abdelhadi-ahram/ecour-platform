import {Transition} from '@headlessui/react'
import React from "react"

import {
  useLazyQuery, gql
} from "@apollo/client"

import {
  useNavigate
} from 'react-router-dom'

const LOGOUT = gql`
  query Logout{
    logout
  }
`;

function Logout({onCancel}){
  const [isShown, setIsShown] = React.useState(false)
  const [logout, {data, error, client}] = useLazyQuery(LOGOUT)

  const navigate = useNavigate()


  React.useEffect(()=> {
    setTimeout(()=>setIsShown(true), 500)
  }, [])

  React.useEffect(() => {
    if(data?.logout){
      client.resetStore()
      navigate("/login")
    }
  })

  function hideLogoutDialog(){
    setIsShown(false)
    onCancel()
  }

  return(
    <div class="fixed inset-0 z-40">
      <div className="fixed inset-0 bg-black opacity-20 dark:opacity-40 z-40"></div>
      <div className="fixed inset-0 bg-transparent z-50 relative flex flex-col items-center">
        <Transition
          as={React.Fragment}
          show={isShown}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-y-full"
          enterTo="translate-y-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-y-0"
          leaveTo="-translate-y-full"
        >
          <div className="w-[92%] sm:w-[450px] bg-white dark:bg-zinc-800 z-40 rounded-xl translate-y-12 px-6 py-5 shadow-lg flex flex-col space-y-2">
            <p className='font-bold text-gray-800 dark:text-gray-200 text-xl'>Logout</p>
            <p className='font-bold text-gray-400 text-lg'>Are you sure you want to logout?</p>
            <div className="flex justify-end items-center py-2">
              <button className="text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 bg-gray-50 dark:bg-zinc-700 rounded-lg px-3 py-2 mx-3" onClick={hideLogoutDialog}>Cancel</button>
              <button onClick={() => logout()} className="text-red-500 bg-red-50 dark:bg-zinc-700 rounded-lg px-3 py-2 font-semibold dark:hover:bg-zinc-600 dark:text-red-400 dark:border dark:border-red-400">Logout</button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  )
}

export default Logout
