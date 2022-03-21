import {
  Link, useParams
} from "react-router-dom"

function SelectType(){
  const {sectionId} = useParams()

  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center">
      <div className="bg-black opacity-20 fixed inset-0  z-0"></div>
      <div className="w-[400px] p-6 rounded-xl bg-white z-10 flex flex-col items-center justify-center space-y-1">
        <div className="w-full flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-gray-700 font-bold text-md">Select a type</p>
          </div>
          <div>
            <Link to={`/my/add-lecture-text/${sectionId}`}>
              <div className="flex items-center space-x-3 w-full rounded-lg p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-500 hover:font-semibold cursor-pointer">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <p className="">Text</p>
              </div>
            </Link>
            <Link to={`/my/add-lecture-file/${sectionId}`}>
              <div className="flex items-center space-x-3 w-full rounded-lg p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-500 hover:font-semibold cursor-pointer">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                <p className="">File</p>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SelectType;
