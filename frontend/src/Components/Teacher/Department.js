import React from "react";
import Section from "./Section";
import {AddLecture} from "../Dialog/TeacherDialogs"


import {
  useQuery,
  useLazyQuery,
  gql
} from "@apollo/client"

import {
  Link
} from "react-router-dom"

export const SelectedDepartment = React.createContext(0);


const GET_LECTURES = gql`
  query GetElementLectures($teachingId : ID!){
    getElementLectures(teachingId : $teachingId) {
      sections{
        name
        lectures {
          id
          title
          type
        }
        homeworks {
          id 
          title 
          deadline
        }
      }
    }
  }
`;


function Lectures(){
    const teachingId = React.useContext(SelectedDepartment)

    const { loading, error, data } = useQuery(
      GET_LECTURES, {variables : {teachingId}}
    );

    if(error) return <b className="text-red-500">Error occured</b>

    if(data){
      const sections = data.getElementLectures.sections
      return (
        <>
          {
            sections.map((section, index) => {
              if(!section.lectures.length && !section.homeworks.length) return null
              return <Section key={index} section={section} />
            })
          }
        </>
      )
    }

    return <b>Witing for data... </b>
}


const GET_TEACHINGS = gql`
  query GetTeachings{
    getTeachings {
      id
      department{
        name
        id
      }
    }
  }
`;

function Departments(){
  const [selectedDepartment, setSelectedDepartment] = React.useState(0)

  const { loading, error, data } = useQuery(GET_TEACHINGS);

  React.useEffect(() => {
    if(data){
      setSelectedDepartment(data.getTeachings[0].id)
      console.log(selectedDepartment)
    }
  }, [data])

  if (error) {return <b className="text-red-500">Error occurred</b>}

	return(
		<div className="flex flex-col space-y-3 flex-1">
      <div className="py-1 sticky top-0 bg-gray-100">
    		<div className="rounded-xl bg-white flex overflow-hidden shadow p-1">
        {
          data?.getTeachings.map((teaching, index) => {
            let selected = teaching.id == (selectedDepartment)
            const selectedClass = "bg-blue-50 text-blue-500";
            const unselectedClass = "bg-white text-gray-500 hover:text-gray-700"
            return <div onClick={() => {setSelectedDepartment(teaching.id); console.log(selectedDepartment)}} key={index} className={`w-32 flex items-center justify-center p-1 rounded-lg font-semibold cursor-pointer ${selected ? selectedClass : unselectedClass}`}>{teaching.department.name}</div>
          })
        }
    		</div>
      </div>

  			<div className="w-full bg-white rounded-lg px-3 py-2">
  				<div className="flex items-center justify-end">
  					<Link to="/my/select-section">
              <button className="px-3 py-1 rounded-lg text-sky-500 bg-blue-50 hover:text-sky-600 focus:ring-1 focus:ring-sky-300">+ Add</button>
            </Link>
          </div>

          <div>          
            <SelectedDepartment.Provider value={selectedDepartment}>
              <AddLecture />
      				<div className="flex flex-col space-y-8">
                  <Lectures />
      				</div>
            </SelectedDepartment.Provider>
          </div>
  			</div>
		</div>
	)
}

export default Departments;
