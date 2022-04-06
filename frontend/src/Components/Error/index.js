import React from "react";
import image from "error-image.svg"

function Error(){
	return(
		<div className="flex flex-col grow-1 items-center justify-center space-y-3">
			<div>{image}</div>
		</div>
	)
}

export default Error;