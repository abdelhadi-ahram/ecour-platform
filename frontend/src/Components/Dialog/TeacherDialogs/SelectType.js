import {
  Link, useParams, useNavigate
} from "react-router-dom"

function SelectType(){
  const {sectionId} = useParams()

  const navigate = useNavigate()

  function cancelClicked(){
    navigate("/my/home")
  }

  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center">
      <div className="bg-black opacity-20 dark:opacity-30 fixed inset-0  z-0" onClick={cancelClicked}></div>
      <div className="w-[92%] sm:w-[400px] p-6 rounded-xl bg-white dark:bg-zinc-800 z-10 flex flex-col items-center justify-center space-y-1">
        <div className="w-full flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-gray-700 dark:text-gray-300 font-bold text-md">Select a type</p>
          </div>
          <div>
            <Link to={`/my/home/add-lecture-text/${sectionId}`}>
              <div className="flex items-center space-x-3 w-full rounded-lg p-2 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-zinc-700 hover:text-blue-500 dark:hover:text-blue-400 hover:font-semibold cursor-pointer">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <p className="">Text</p>
              </div>
            </Link>
            <Link to={`/my/home/add-lecture-file/${sectionId}`}>
              <div className="flex items-center space-x-3 w-full rounded-lg p-2 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-zinc-700 hover:text-blue-500 dark:hover:text-blue-400 hover:font-semibold cursor-pointer">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                <p className="">File</p>
              </div>
            </Link>
            <Link to={`/my/home/add-homework/${sectionId}`}>
              <div className="flex items-center space-x-3 w-full rounded-lg p-2 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-zinc-700 hover:text-blue-500 dark:hover:text-blue-400 hover:font-semibold cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                <p className="">Homework</p>
              </div>
            </Link>
            <Link to={`/my/home/add-exam/${sectionId}`}>
              <div className="flex items-center space-x-3 w-full rounded-lg p-2 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-zinc-700 hover:text-blue-500 dark:hover:text-blue-400 hover:font-semibold cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="">Exam</p>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SelectType;
