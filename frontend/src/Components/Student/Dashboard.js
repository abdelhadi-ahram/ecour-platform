import React from 'react';
import Card from './Card';
import classesImages from "./images";
import {Transition} from "@headlessui/react";
import {COURSES} from "../api"
import Element from "./Element"

import {
  useQuery,
  gql
} from "@apollo/client"

const LastCourses = [
  {
    "module" : "Module 1",
    "name" : "Algorithms and C",
    "teacher" : "Mr. Sabour"
  },
  {
    "module" : "Module 09",
    "name" : "Algebra 02",
    "teacher" : "Mr. Ait Zemzami"
  },
  {
    "module" : "Module 10",
    "name" : "Java",
    "teacher" : "Mr. Mazoul"
  }];

const GET_ELEMENTS = gql`
  query GetDepartmentModules{
   getDepartmentModules{
    name
    elements{
      id
      name
      progress
    }
  }
}
`;

export default function Dashboard(){

  const {data, loading, error} = useQuery(GET_ELEMENTS, {fetchPolicy : "network-only"})

  if(error){
    return <b className="text-red-500 font-bold text-lg">Error occurred</b>
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2 bg-white dark:bg-zinc-800 p-4 rounded-lg">
        <p className="text-md font-semibold text-gray-700 dark:text-gray-200">Last accessed courses</p>
        <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:space-x-4">
          {LastCourses.map((item, index) => {
              return(
                <div className="lg:w-1/3">
                  <Card item={item} key={index} index={index} />
                </div>
              )
            })}
        </div>
      </div>

    		<div className=" w-full space-y-4 p-4 rounded-lg bg-white dark:bg-zinc-800 shadow p-1">
          <div className="flex justify-between">
            <h2 className="text-gray-700 dark:text-gray-200 font-semibold">Courses Progress</h2>
            <div className="flex items-center justify-center space-x-3 px-4 py-1 rounded-lg border border-gray-200 dark:border-zinc-700 cursor-pointer hover:border-gray-400">
              <p className="text-gray-700 dark:text-gray-200">Filter by</p>
              <svg className="w-6 h-6 text-gray-400 dark:border-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </div>
          </div>
          <div className="flex flex-col space-y-2 md:grid md:grid-cols-2 md:gap-4">
          {
            (data?.getDepartmentModules.map((module_, index) => {
              const moduleName = module_.name
              return module_.elements.map((element, index) => {
                return (
                  <Element module={moduleName} element={element} index={index} key={index}/>
                )
              })
            }))
          }
        </div>
    		</div>
    </div>
  )
}
