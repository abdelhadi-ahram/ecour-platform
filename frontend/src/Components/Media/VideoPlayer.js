import React from "react"
import getFileName from "./getFileName"
import {Transition} from "@headlessui/react"

const PLAYBACK_RATE = [
	0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2
];

function VideoPlayer({src}){
	const videoContainer = React.useRef()
	const videoPlayer = React.useRef()
	const [isOptionsShown, setIsOptionsShown] = React.useState(false)
	const [isPlaybackShown, setIsPlaybackShown] = React.useState(false)
	const [isPlaying,setIsPalying] = React.useState(false)
	const [isHovering, setIsHovering] = React.useState(false)
	const [playbackRate, setPlaybackRate] = React.useState(1)
	const [videoStatus, setVideoStatus] = React.useState({})

	React.useEffect(() => {
		var timer;
		if(isHovering){
			timer = setTimeout(() => setIsHovering(false), 5000)
		}

		return () => clearTimeout(timer)
	}, [isHovering])

	React.useEffect(() => {
		function playVideo(e){
			if(e.keyCode == 32){
				e.preventDefault()
				playOrPause()
			}
		}

		function setTimeLocally(){
			const media= videoPlayer.current
			const status = {}

			const minutes = Math.floor(media.currentTime / 60);
			const seconds = Math.floor(media.currentTime - minutes * 60);

			const minuteValue = minutes.toString().padStart(2, '0');
			const secondValue = seconds.toString().padStart(2, '0');

			const mediaTime = `${minuteValue}:${secondValue}`;
			status["time"] = mediaTime;

			const barLength = 100 * (media.currentTime/media.duration);
			status["barLength"] = `${parseInt(barLength)}%`;

			setVideoStatus(status)
		}

		document.addEventListener("keyup", playVideo)
		videoPlayer.current.addEventListener('timeupdate', setTimeLocally);

		return () => {
			document.removeEventListener('keyup', playVideo)
			videoPlayer.current.removeEventListener('timeupdate', setTimeLocally);
		}
	}, [])

	React.useEffect(() => {
		videoPlayer.current.playbackRate = playbackRate
	}, [playbackRate])

	function hideShownMenus(){
		if(isOptionsShown) setIsOptionsShown(false)
		if (isPlaybackShown) setIsPlaybackShown(false)
	}

	function requestFullScreen(){
		var doc = window.document
		var docEl = videoContainer.current;
		console.log(videoContainer)
		var requestFullScreen =
		docEl.requestFullscreen ||
		docEl.mozRequestFullScreen ||
		docEl.webkitRequestFullScreen ||
		docEl.msRequestFullscreen;
		var cancelFullScreen =
		doc.exitFullscreen ||
		doc.mozCancelFullScreen ||
		doc.webkitExitFullscreen ||
		doc.msExitFullscreen;

		if (
			!doc.fullscreenElement &&
			!doc.mozFullScreenElement &&
			!doc.webkitFullscreenElement &&
			!doc.msFullscreenElement
		) {
			requestFullScreen.call(docEl);
		} else {
			cancelFullScreen.call(doc);
		}
	}

	function playOrPause(){
		const video = videoPlayer.current
		if(video.paused){
			video.play()
			setIsPalying(true)
		} else {
			video.pause()
			setIsPalying(false)
		}
	}

	return (
		<div onMouseMove={() => {isHovering || setIsHovering(true)}} onMouseLeave={() => setIsHovering(false)} ref={videoContainer} className="relative bg-black overflow-hidden rounded-md shadow w-full md:w-[60%] lg:w-[50%]">
			<Transition
				show={isHovering}
				enter="transition-opacity duration-[300ms]"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-[300ms]"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className="absolute inset-0 select-none">
					<div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90"></div>
					{(isOptionsShown || isPlaybackShown) &&
						<div onClick={hideShownMenus} className="absolute inset-0 z-20 bg-transparent opacity-90"></div>
					}
					<div className="relative w-full h-full flex flex-col justify-between">
						<div className="flex justify-between items-center text-white py-2 px-2">
							<p className="truncate">{getFileName(src)}</p>
							<div className="relative">
								<div className="p-1" onClick={() => setIsOptionsShown(!isOptionsShown)}>
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
								</div>
							{isOptionsShown &&
								<div className="absolute z-40 right-0 bg-white dark:bg-zinc-700 w-32 py-1 rounded-md">
									<div className="flex items-center space-x-2 text-sm hover:bg-zinc-600 p-1 px-2 py-1">
										<span><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></span>
										<p>Download</p>
									</div>
								</div>
							}
							</div>
						</div>
						<div className="relative h-full">
							{
								isPlaybackShown &&
								<div className="absolute z-40 bottom-0 right-2 bg-white dark:bg-zinc-700 w-48 py-1 rounded-md overflow-y-auto max-h-48">
								{
									PLAYBACK_RATE.map((item, index) => {
										return (<div key={index} onClick={() => setPlaybackRate(item)} className="flex items-center space-x-2 justify-between text-sm hover:bg-zinc-600 p-1 px-2 py-1">
											<p>{item == 1 ? "Normal" : item}</p>
											<span>{
												playbackRate == item && (
													<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
												)
											}</span>
										</div>)
									})
								}
								</div>
							}
						</div>
						<div className="relative flex flex-col space-y-2 items-center text-white py-2">
							<div className="bg-gray-100 w-full h-1 rounded-full">
								<div style={{width: videoStatus['barLength']}} className={`h-1 bg-blue-500`}></div>
							</div>
							<div className="flex justify-between px-3 w-full">
								<div className="flex">
									<div className="flex space-x-3">
										<span className="text-gray-400"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" /></svg></span>
										<div onClick={playOrPause}>
											<span className="text-gray-300 hover:text-gray-100">
											{ isPlaying ? (
												<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
											) :(
												<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
											)
											}
											</span>
										</div>
										<span className="text-gray-400"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" /></svg></span>
										<span className="text-gray-300">{videoStatus["time"]}</span>
									</div>
								</div>

								<div className="flex">
									<div className="flex space-x-3">
										<span onClick={() => setIsPlaybackShown(true)} className="text-gray-400 hover:text-gray-20"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></span>
										<span onClick={requestFullScreen} className="text-gray-400 hover:text-gray-20"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg></span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Transition>
			<video ref={videoPlayer} width="100%" height="100%" controls={false} src={src} >Your browser does not support video format</video>
		</div>
	)
}

export default VideoPlayer