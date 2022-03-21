import React from "react"
import {Transition} from "@headlessui/react"


function Alert({text}){
  const [isShown, setIsShown] = React.useState(false)

  React.useEffect(() => {
    const controller = new AbortController();
    setIsShown(true)
    setTimeout(() => setIsShown(false), 5000)
  }, [])

  return(
    <Transition
      as={React.Fragment}
      show={isShown}
      enter="transition ease-in-out duration-300 transform"
      enterFrom="translate-y-full"
      enterTo="translate-y-0"
      leave="transition ease-in-out duration-300 transform"
      leaveFrom="translate-y-0"
      leaveTo="translate-y-full"
    >
      <div className="w-[300px] fixed bottom-4 right-4 rounded-lg bg-gray-700 text-white shadow p-3">
        {text}
      </div>
    </Transition>
  )
}

export default Alert;
