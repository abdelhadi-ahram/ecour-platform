import React from "react"
import {faPlay} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CodeViewer from './CodeViewer'
//import Highlight from 'react-highlight'
import 'highlight.js/styles/atom-one-dark.css';
import hljs from 'highlight.js';


const BlockCode = React.forwardRef( ({attributes, children}, ref) => {
  let code = React.createRef();
  const [isShown, setIsShown] = React.useState(false)

  const  [htmlCode, setHtmlCode] = React.useState("");

  function runCode(){
    setHtmlCode(code.current.innerText);
    setIsShown(true)
  }

  return (
    <div ref={ref} className="my-3 bg-gray-700 p-2 rounded text-white shadow font-mono relative" {...attributes}>
      {isShown &&
        <div className="fixed inset-0 flex flex-col items-center justify-center z-20">
          <div className="fixed inset-0 bg-black opacity-25" onClick={() => {setIsShown(false)}}></div>
          <div className="w-3/4 z-20">
            <CodeViewer value={htmlCode} />
          </div>
        </div>
      }
      <button onClick={runCode} contentEditable={false} className="w-8 h-8 rounded-full shadow absolute top-2 right-2 flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 text-gray-200 hover:text-white">
        <FontAwesomeIcon className="w-6 h-6" icon={faPlay} />
      </button>
      <div ref={code} className="w-full h-full">{children}</div>
      {/* <Highlight contentEditable={true} ref={code} className='html ' >
        {children}
      </Highlight> */}
    </div>
  )
});


export default BlockCode;
