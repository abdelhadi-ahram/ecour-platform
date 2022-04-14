
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
      <div className="bg-black opacity-20 dark:opacity-60 fixed inset-0  z-0"></div>
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
        <div className="w-[92%] sm:w-[400px] p-6 rounded-xl bg-white dark:bg-zinc-800 z-40 flex flex-col items-center justify-center space-y-1">
          <div className="w-full flex flex-col space-y-4">
            <p className="text-gray-700 dark:text-gray-300 text-lg font-bold">Do you agree?</p>
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-semibold dark:font-normal">Once you launch this exam:
                <ol className="text-gray-600 dark:text-gray-400 list-disc pl-4 py-2 font-normal">
                  <li>You must not Refresh the page</li>
                  <li>Full screen will be anabled and if you canceled it you can click on <code className="bg-gray-100 dark:bg-zinc-700 px-1 rounded">F11</code></li>
                  <li>You can not click anything out of the page, or switch to another widow, or another program</li>
                  <li>Any cheating attempt will prevent you from continuing the exam and report you</li>
                </ol>
              </p>
            </div>
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

