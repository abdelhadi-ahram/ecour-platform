import {Transition} from '@headlessui/react'
import React from "react"

function DeleteDialog({onCancel, onDelete}){
  const [isShown, setIsShown] = React.useState(false)

  React.useEffect(()=> {
    setTimeout(()=>setIsShown(true), 500)
  })

  function hideLogoutDialog(){
    setIsShown(false)
    onCancel()
  }

  function deleteClicked(){
    onDelete();
    hideLogoutDialog();
  }

  return(
    <div className="fixed inset-0">
      <div className="fixed inset-0 bg-black opacity-20 dark:opacity-40 z-40"></div>
      <div className="fixed inset-0 bg-transparent z-50 relative flex flex-col items-center">
        <Transition
          show={isShown}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-y-full"
          enterTo="translate-y-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-y-0"
          leaveTo="-translate-y-full"
        >
          <div className="w-[92%] sm:w-[450px] bg-white dark:bg-zinc-800 rounded-xl translate-y-12 px-6 py-5 shadow-lg flex flex-col space-y-2">
            <p className='font-bold text-gray-800 dark:text-gray-200 text-xl'>Logout</p>
            <p className='font-bold text-gray-400 text-lg'>Are you sure you want to logout?</p>
            <div className="flex justify-end items-center py-2">
              <button className="cancel-btn" onClick={hideLogoutDialog}>Cancel</button>
              <button className="text-red-500 bg-red-50 rounded-lg px-3 py-2 font-semibold" onClick={deleteClicked} >Delete</button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  )
}

export default DeleteDialog
