import React from "react";
import Section from "./Section";
import {AddLecture} from "../Dialog/TeacherDialogs"
import {LoadingCard} from "../Loadings"
import {selectButton} from "../Sidebar.js"

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
        exams {
          id 
          title
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
              if(!section.lectures.length && !section.homeworks.length && !section.exams.length) return null
              return <Section key={index} section={section} />
            })
          }
        </>
      )
    }

    return (
      <div className="flex space-x-3"><LoadingCard /><LoadingCard /><LoadingCard /></div>
    )
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

  React.useEffect(() => {
    selectButton("Home")
  }, [])

  if (error) {return <b className="text-red-500">Error occurred</b>}

	return(
		<div className="flex flex-col space-y-3 flex-1">
      <div className="py-1 md:sticky md:top-0 bg-gray-100 dark:bg-zinc-900">
    		<div className="rounded-xl bg-white dark:bg-zinc-800 flex overflow-hidden shadow p-1">
        {
          data?.getTeachings.map((teaching, index) => {
            let selected = teaching.id == (selectedDepartment)
            const selectedClass = "bg-blue-50 dark:bg-zinc-700 text-blue-400";
            const unselectedClass = "bg-white dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            return <div onClick={() => {setSelectedDepartment(teaching.id); console.log(selectedDepartment)}} key={index} className={`w-32 flex items-center justify-center p-1 rounded-lg font-semibold cursor-pointer ${selected ? selectedClass : unselectedClass}`}>{teaching.department.name}</div>
          })
        }
    		</div>
      </div>

  			<div className="w-full bg-white dark:bg-zinc-800 rounded-lg px-3 py-2">
  				<div className="flex items-center justify-end">
  					<Link to="/my/home/select-section">
              <button className="add-btn">+ Add</button>
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
