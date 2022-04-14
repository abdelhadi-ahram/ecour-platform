import React from "react";
import {selectButton} from "../../Sidebar.js"
import {
	useQuery,
	gql
} from "@apollo/client"

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


function StudentManagment(){
	const [selectedDepartment, setSelectedDepartment] = React.useState(0)

	const { loading, error, data } = useQuery(GET_TEACHINGS);

	React.useEffect(() => {
		if(data){
			setSelectedDepartment(data.getTeachings[0].id)
		}
	}, [data])

	React.useEffect(() => {
		selectButton("Students")
	} , [])

	return(
		<div className="flex flex-col space-y-4">
			<div className="py-1 sticky top-0 bg-gray-100 dark:bg-zinc-900">
	    		<div className="rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-between overflow-hidden shadow p-1">
			        <div className="flex items-center">
				        {
				          data?.getTeachings.map((teaching, index) => {
				            let selected = teaching.id == (selectedDepartment)
				            const selectedClass = "bg-blue-50 dark:bg-zinc-700 text-blue-500";
				            const unselectedClass = "bg-white dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
				            return <div onClick={() => {setSelectedDepartment(teaching.id); console.log(selectedDepartment)}} key={index} className={`w-32 flex items-center justify-center p-1 rounded-lg font-semibold cursor-pointer ${selected ? selectedClass : unselectedClass}`}>{teaching.department.name}</div>
				          })
				        }
			        </div>
			        
	    		</div>
	    </div>
			
			<div className="flex flex-col space-y-1 px-2 py-3 dark:bg-zinc-800 rounded-md">
				<div className="flex justify-between items-center p-2 hover:bg-zinc-700 rounded-md select-none">
					<div className='dark:text-gray-300 flex items-center space-x-3'>
						<span className="text-gray-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></span>
						<span className="text-gray-300">Presence</span>
					</div>
					<span className="text-green-400 hover:text-green-500">
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
					</span>
				</div>
				<div className='p-2 dark:text-gray-300 flex items-center space-x-3 hover:bg-zinc-700 rounded-md select-none'>
					<span className="text-gray-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg></span>
					<span className="text-gray-300">Students</span>
				</div>
			</div>
		</div>
	)
}

export default StudentManagment;