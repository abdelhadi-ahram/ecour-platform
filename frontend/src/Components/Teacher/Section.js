import React from "react"
import Lectures from "./Lectures"
import Homeworks from "./Homeworks"


function Section({section}){
  

	return(
		<div>
  		<div>
  			<p className="text-gray-900 dark:text-gray-200 font-semibold text-md">{section.name}</p>
  		</div>
  		<div className="flex flex-col space-y-2 ">
  			{
          <Lectures lectures={section.lectures} />
        }

        {
          <Homeworks homeworks={section.homeworks} />
        }

  		</div>
		</div>
	)
}


export default Section;
