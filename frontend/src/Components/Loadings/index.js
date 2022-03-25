

export function PulseSquare({width, height}){
	return (
		<div className={`w-${width} h-${height} bg-gray-100 animate-pulse rounded-lg`}></div>
	)
}