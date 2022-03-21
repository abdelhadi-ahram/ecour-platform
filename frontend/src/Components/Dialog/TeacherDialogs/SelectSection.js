import React from "react"
import {Transition} from "@headlessui/react"

import {SelectedDepartment} from "../../Teacher/Department"

import {
  useQuery,
  gql
} from "@apollo/client"

import {Link, useNavigate} from "react-router-dom"

const GET_LECTURES_SECTIONS = gql`
  query GetElementSection($teachingId : ID!){
    getElementLectures(teachingId : $teachingId) {
      sections{
        id
        name
      }
    }
  }
`;


function SelectSection(){
  const teachingId = React.useContext(SelectedDepartment)
  const {data, Loading, error} = useQuery(GET_LECTURES_SECTIONS, {variables : {teachingId}})

  const [showAdd, setShowAdd] = React.useState(false)

  const navigate = useNavigate()

  function cancelClicked(){
    navigate("/my")
  }

  return(
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center">
      <div className="bg-black opacity-20 fixed inset-0  z-0" onClick={cancelClicked}></div>
      <div className="w-[400px] p-6 rounded-xl bg-white z-10 flex flex-col items-center justify-center space-y-1">
        <div className="w-full flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-gray-700 font-bold text-md">Select a section</p>
            <button className="w-7 h-7 rounded-full bg-blue-50 text-blue-400 text-2xl flex items-center justify-center font-bold cursor-pointer focus:ring-1 focus:ring-blue-400 border border-white" onClick={() => setShowAdd(true)}>+</button>
          </div>
          <div>
          {
            data?.getElementLectures?.sections?.map((section, index) => {
              return (
                <Link key={index} to={`/my/select-type/${section.id}`}>
                  <div className="text-gray-600 w-full rounded-md p-2 hover:bg-gray-100 hover:text-gray-800">{section.name}</div>
                </Link>
              )
            })
          }
            <Transition
              as={React.Fragment}
              show={showAdd}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="scale-y-0"
              enterTo="scale-y-1"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="scale-y-1"
              leaveTo="scale-y-0"
            >
            <input className="mt-1 text-gray-700 w-full rounded-md p-2 bg-gray-50 focus:outline-none border border-white ring-1 ring-gray-300" placeholder="Add a section" />
            </Transition>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SelectSection
