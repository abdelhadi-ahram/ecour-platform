
export default function getFileName(file){
	const arr = file?.split("/");
	if(arr) return arr[arr.length-1]
	return ""
}