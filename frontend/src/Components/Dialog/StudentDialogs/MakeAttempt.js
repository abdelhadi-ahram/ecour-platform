
import {useParams, useNavigate} from "react-router-dom"
import React from "react"
import {Transition} from "@headlessui/react"
import {LoadingCard} from "../../Loadings"

import {
  useMutation,
  gql
} from "@apollo/client";

const CREATE_ATTEMPT = gql`
  mutation CreateAttempt($examId: ID!){
    createAttempt(examId: $examId) {
      attemptId
    }
  }
`;

function MakeAttempt({isShowing, onCancel}){
  const {examId} = useParams()
  const navigate = useNavigate()

  const [createAttempt, {data, error, loading}] = useMutation(CREATE_ATTEMPT, {
    variables : {examId},
  })


  function cancelClicked(){
    onCancel()
  }


  function requestAnAttempt(){
    createAttempt();
  }

  React.useEffect(() => {
    if(data){
      navigate(`/my/attempt/${data?.createAttempt.attemptId}`)
    }
  }, [data])

  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center">
      <div className="bg-black opacity-20 dark:opacity-40 fixed inset-0  z-0"></div>
      <Transition
          as={React.Fragment}
          appear="true"
          show={isShowing}
          enter="transform transition duration-[400ms]"
          enterFrom=" scale-0"
          enterTo="scale-100"
          leave="transform transition duration-[400ms]"
          leaveFrom="scale-100"
          leaveTo="scale-0"
        >
        <div className="w-[400px] p-6 rounded-xl bg-white dark:bg-zinc-800 z-40 flex flex-col items-center justify-center space-y-1">
          <div className="w-full flex flex-col space-y-4">
            <p className="text-gray-600 dark:text-gray-400 font-semibold">Are you sure?</p>

            <div className="flex items-center justify-center">
              <button onClick={cancelClicked} className="cancel-btn">Cancel</button>
              <button onClick={requestAnAttempt} className="post-btn py-[5px]">Pass exam</button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  )
}



export default MakeAttempt;

