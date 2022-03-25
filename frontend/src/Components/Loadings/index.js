

export function PulseSquare({width, height}){
	return (
		<div className={`w-${width} h-${height} bg-gray-100 animate-pulse rounded-lg`}></div>
	)
}

export function LoadingPage(){
	return (
		<div className="fixed inset-0">
			<div className="fixed inset-0 bg-black opacity-10"></div>
			<div className="fixed inset-0 flex flex-col items-center justify-center z-10">
				<div className="relative">
					<div className="absolute inset-0 text-blue-400">
						<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>
					</div>
					<div className="relative text-blue-400">
						<svg className="w-10 h-10 animate-ping" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
					</div>
				</div>
			</div>
		</div>
	)
}