import React from "react"
import {faPlay} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const BlockCode = React.forwardRef( ({attributes, children}, ref) => {
  let code = React.createRef();

  return (
    <div ref={ref} className="my-3 bg-gray-700 p-2 rounded text-white shadow font-mono relative" {...attributes}>

    </div>
  )
});


export default BlockCode;
