
import {useParams} from "react-router-dom"

function SelectType(){
  const {sectionId} = useParams()

  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center">
      <div className="bg-black opacity-20 fixed inset-0  z-0"></div>
      <div className="w-[800px] p-6 rounded-xl bg-white z-10 flex flex-col items-center justify-center space-y-1">
        <div className="w-full flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-gray-700 font-bold text-md">Select a type</p>
          </div>
          <div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default SelectType;
