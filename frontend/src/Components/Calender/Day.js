import moment from "moment"


function Day({dateObject, showMonth}){
  var weekdaysShort = moment.weekdaysShort()

  function firstDayOfMonth() {
    let firstDay = moment(dateObject)
                 .startOf("month")
                 .format("d");
    return firstDay;
  }

  let blanks = [];
  for (let i = 0; i < firstDayOfMonth(); i++) {
    blanks.push(
      <td className="cursor-none bg-gray-50 dark:bg-zinc-800">{""}</td>
    );
  }

  function getCurrentDay(){
    return dateObject.format("D")
  }

  function getCurrentDate(){
    return `${dateObject.format("MMM")} ${dateObject.format("yyyy")}`
  }

  let daysInMonth = [];
   for (let d = 1; d <=31; d++) {
     let isCurrentDay = d == getCurrentDay();
     daysInMonth.push(
       <td key={d} className="cursor-pointer text-gray-500 dark:text-gray-400">
         <div className={`p-1 text-sm block ${isCurrentDay ? "text-blue-400 font-bold bg-blue-50 dark:bg-zinc-700" : "hover:-translate-y-1 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-gray-700 dark:hover:text-gray-300"} rounded-lg`}>{d}</div>
       </td>
     );
   }

  var totalSlots = [...blanks, ...daysInMonth];
  let rows = [];
  let cells = [];

  totalSlots.forEach((row, i) => {
    if (i % 7 !== 0) {
      cells.push(row); // if index not equal 7 that means not go to next week
    } else {
      rows.push(cells); // when reach next week we contain all td in last week to rows
      cells = []; // empty container
      cells.push(row); // in current loop we still push current row to new container
    }
    if (i === totalSlots.length - 1) { // when end loop we add remain date
      rows.push(cells);
    }
  });

  return(
    <div className="bg-white dark:bg-zinc-800 rounded-xl px-3 py-5 shadow flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-gray-700 dark:text-gray-200 font-semibold text-md hover:bg-gray-100 dark:hover:bg-zinc-700 px-2 py-1 rounded cursor-pointer" onClick={showMonth}>{getCurrentDate()}</p>
        <div className="flex items-center space-x-3 text-blue-400">
          <span className="rounded-full bg-blue-50 dark:bg-zinc-700 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </span>
          <span className="rounded-full bg-blue-50 dark:bg-zinc-700 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </span>
        </div>
      </div>
      <table className='w-full text-center'>
        <thead>
          <tr>
          {weekdaysShort.map(day => {
            return <th className="text-sm text-gray-500 dark:text-gray-400 font-semibold">{day}</th>
          })}
          </tr>
          </thead>
         <tbody>
         {rows.map((d, i) => {
           return <tr>{d}</tr>
         })}
         </tbody>
       </table>
    </div>
  )
}

export default Day;
