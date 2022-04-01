import moment from "moment"

function Month({dateObject}){

  function getCurrentYear(){
    return `${dateObject.format("yyyy")}`
  }

  function getCurrentMonth(){
    return dateObject.format('MMM')
  }

  function getMonths(){
    let months = []
    let rows = []
    moment.monthsShort().map((month, index) => {
      if(index % 3 === 0) {
        months.push(rows)
        rows = []
      }
      let isActive = month === getCurrentMonth() ? true : false
      rows.push(
        <td key={index} className={`text-center cursor-pointer p-1 ${isActive ? "text-blue-400 font-bold bg-blue-50 dark:bg-zinc-700 rounded-lg" : "text-gray-600 dark:text-gray-400  hover:-translate-y-[2px] hover:text-gray-800 dark:hover:text-gray-200 hover:font-bold"}`}>{month}</td>
      )
    })

    return months
  }

  return(
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow px-3 py-5 flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-gray-700 dark:text-gray-300 font-bold text-md hover:bg-gray-100 dark:hover:bg-zinc-700 px-2 py-1 rounded cursor-pointer">{getCurrentYear()}</p>
      </div>
      <div cassName="flex flex-col">
        <div class="w-full p-1 rounded-lg text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-700 font-bold text-center">Select a month</div>
        <table className="w-full mt-2">
          <tbody>
          {getMonths().map((month, index) => {
            return <tr>{month}</tr>
          })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/*
<div cassName="flex flex-col">
  <div class="w-full p-1 rounded-lg text-gray-500 bg-gray-50 font-bold text-center">Select a month</div>
  <table className="w-full mt-2">
    <tbody>
    {getMonths().map((month, index) => {
      return <tr>{month}</tr>
    })}
    </tbody>
  </table>
</div>
*/
export default Month
