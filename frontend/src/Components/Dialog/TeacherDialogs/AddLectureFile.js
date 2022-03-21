
import {useParams, useNavigate} from "react-router-dom"
import React from "react"
import DragAndDrop from "../../DragFile"


function AddLectureFile({update}){
  const {sectionId} = useParams()
  const navigate = useNavigate()

  const [drag, setDrag] = React.useState(false)
  const [file, setFile] = React.useState(null)

  function cancelClicked(){
    navigate("/my")
  }

  function getDragState(state){
    setDrag(state)
  }

  function onDrop(files){
    if (files[0]) setFile(files[0])
  }

  function onChooseFile(e){
    e.preventDefault()
    const files = e.target.files
    if (files[0]) setFile(files[0])
  }

  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center">
      <div className="bg-black opacity-20 fixed inset-0  z-0"></div>
      <div className="w-[400px] p-6 rounded-xl bg-white z-10 flex flex-col items-center justify-center space-y-1">
        <div className="w-full flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <p className="text-gray-600 font-semibold">Title</p>
              <input className="w-full rounded border border-gray-200 px-2 py-1 focus:outline-none hover:border-gray-300" />
            </div>

            <div className="flex flex-col space-y-1">
              <p className="text-gray-600 font-semibold">Content</p>
              <div className="w-full ">

                <DragAndDrop setDrag={setDrag} onDrop={onDrop}>
                  <div className={`rounded-lg ${drag ? "bg-blue-50" : "bg-white"} h-full border-2 border-dashed border-blue-400 flex flex-col items-center justify-center py-4`}>
                    {
                      file ? (                          
                        <p className="text-gray-700 w-3/4 text-center font-semibold my-3">{file.name + " (" + Math.round((file.size / 1024)) + "KB)"}</p> 
                      ):(
                        <>
                          <div className="text-blue-400">
                            <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                          </div>
                          <p className="text-gray-700 w-3/4 text-center text-sm font-semibold">Drag your document here to start uploading</p>
                          <div className="flex items-center justify-center space-x-1">
                            <div className="h-[1px] w-10 bg-gray-500"></div>
                            <span className="text-gray-500 text-xs my-2">OR</span>
                            <div className="h-[1px] w-10 bg-gray-500"></div>
                          </div> 
                        </>
                      )
                    }
                    <div className="relative">
                      <input type="file" className="absolute inset-0 bg-green-500 w-full opacity-0" onChange={onChooseFile} />
                      <button className="text-blue-500 font-semibold border border-blue-400 rounded-lg px-3 py-[6px]">Browse files</button>
                    </div>
                  </div>
                </DragAndDrop>

              </div>
            </div>

            <div className="flex items-center justify-end">
              <button onClick={cancelClicked} className="px-4 py-[6px] text-gray-500 bg-gray-100 rounded-md mx-3 text-md hover:bg-gray-200 hover:text-gray-600">Cancel</button>
              <button className="px-4 py-[6px] text-white bg-blue-400 font-bold rounded-md text-md shadow border border-white focus:ring-1 focus:ring-blue-400 hover:shadow-lg">Post</button>
            </div>
        </div>
      </div>
    </div>
  )
}



export default AddLectureFile;

