export default function generateRandomId(){
	const alphabet = [
	"a","b","c","d","e","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y",'z',
	"-",'_',
	1,2,3,4,5,6,7,8,9
	]

	var id = "";
	for(var i=0; i<10; i++){
		let index = Math.floor((Math.random() * 100) % alphabet.length)
		id = id + alphabet[index]
	}
	return id
}