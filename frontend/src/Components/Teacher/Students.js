import React from "react";
import {
	useQuery,
	gql
} from "@apollo/client"

const STUDENTS = [
	{
		"name": "Abdelhadi Ahram",
		"cin" : "JY43767",
		"absence" : "2",
		"homeworks" : "3/4"
	},
	{
		"name": "Adnan Kroum",
		"cin" : "Ab12563",
		"absence" : "1",
		"homeworks" : "5/4"
	},
	{
		"name": "Adel Wahran",
		"cin" : "CY12635",
		"absence" : "5",
		"homeworks" : "4/4"
	}
]

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

function Students(){
	const [selectedDepartment, setSelectedDepartment] = React.useState(0)

	const { loading, error, data } = useQuery(GET_TEACHINGS);

	React.useEffect(() => {
		if(data){
			setSelectedDepartment(data.getTeachings[0].id)
			console.log(selectedDepartment)
		}
	}, [data])

	return(
		<div className="flex flex-col space-y-2">
			<div className="py-1 sticky top-0 bg-gray-100">
		    		<div className="rounded-xl bg-white flex items-center justify-between overflow-hidden shadow p-1">
				        <div className="flex items-center">
					        {
					          data?.getTeachings.map((teaching, index) => {
					            let selected = teaching.id == (selectedDepartment)
					            const selectedClass = "bg-blue-50 text-blue-500";
					            const unselectedClass = "bg-white text-gray-500 hover:text-gray-700"
					            return <div onClick={() => {setSelectedDepartment(teaching.id); console.log(selectedDepartment)}} key={index} className={`w-32 flex items-center justify-center p-1 rounded-lg font-semibold cursor-pointer ${selected ? selectedClass : unselectedClass}`}>{teaching.department.name}</div>
					          })
					        }
				        </div>
				        <div className="text-gray-500 px-2">
				        	<div className="p-1 rounded-lg hover:bg-blue-50 hover:text-blue-400">
			    				<svg className="w-5 h-5 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
			    			</div>
			    		</div>
		    		</div>
		      </div>
			<table className="w-full">
			<tr className="p-2 bg-white">
				<td className="text-gray-900 fnt-semibold  p-2">Full name</td>
				<td className="text-gray-900 fnt-semibold p-2">CIN</td>
				<td className="text-gray-900 fnt-semibold p-2">Absence</td>
				<td className="text-gray-900 fnt-semibold p-2">Homeworks</td>
				<td className="text-gray-900 fnt-semibold p-2">Action</td>
			</tr>
			{
				STUDENTS.map((item, index) => {
					return (
						<tr className={`p-2 ${index % 2? "bg-white" : "bg-gray-50"}`} key={`${item}-${index}`}>
							<td className="text-gray-500 p-2">{item.name}</td>
							<td className="text-gray-500 p-2">{item.cin}</td>
							<td className="text-gray-500 p-2">{item.absence}</td>
							<td className="text-gray-500 p-2">{item.homeworks}</td>
							<td className="text-green-400 p-2">
								<svg className="w-5 h-5 hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
							</td>
						</tr>
					)
				})
			}
			</table>
		</div>
	)
}

export default Students;