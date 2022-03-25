import {useState} from "react"
import moment from "moment"
import Day from "./Day"
import Month from "./Month"

function Calender(){

  const [dateObject, setDateObject] = useState(moment())
  const [isMonthShown, setIsMonthShown] = useState(false)

  function showMonth(){
    setIsMonthShown(true)
  }

  return(
    <>
    { !isMonthShown && <Day showMonth={showMonth} dateObject={dateObject}/> }
    { isMonthShown && <Month dateObject={dateObject}/> }
    </>
  )
}


export default Calender;
