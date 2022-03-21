import React, {useEffect} from "react";
import ResizePanel from "react-resize-panel";

export default function CodeViewer({value}) {
  const [theme, setTheme] = React.useState("light")
  const getHtml = (html) => {
    const val = `
    <html class=${theme}>
    <head>
      <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <script src="https://cdn.tailwindcss.com"></script>
       <script>
         tailwind.defaultConfig.darkMode = "class"
      </script>
    </head>
    <body class="flex flex-col items-center justify-center w-screen h-screen bg-gray-50 dark:bg-gray-700">${html}</body>
    </html>
      `
    return val;
  }

  function configureTheme(){
    setTheme( theme === "light" ? "dark" : "light" )
  }

  return (
    <div className="w-full rounded-lg shadow border border-gray-100 overflow-hidden bg-white">
      <div className="flex justify-between items-center py-1 px-3 border-b border-gray-300">
        <div className="flex space-x-1">
          <div className="bg-red-500 rounded-full w-4 h-4"></div>
          <div className="bg-yellow-500 rounded-full w-4 h-4"></div>
          <div className="bg-green-500 rounded-full w-4 h-4"></div>
        </div>
        <div className="flex space-x-3">
          <button className="rounded-full bg-gray-50 group" onClick={configureTheme}>
            <svg className="w-6 h-6 text-gray-500 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          </button>

          <button className="rounded-full bg-gray-50 group" >
            <svg className="w-6 h-6 text-gray-500 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
          </button>

          <button className="rounded-full bg-gray-50 group">
            <svg className="w-6 h-6 text-gray-500 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
          </button>
        </div>
      </div>

      <div className="block md:flex md:space-x-6 p-1"  >
        <div className="p-2 flex bg-gray-50 w-full border border-gray-200" style={{width:"100%"}} >
          <ResizePanel className="border border-gray-500" direction="e" style={{maxHeight: '400px', minHeight:'170px', minWidth:'350px', maxWidth : "100%"}}>
              <div style={{width:'100%', height: '100%'}}>
                <iframe srcDoc={getHtml(value)} className="container" style={{minHeight:170, maxHeight:350}} scrolling="no" frameBorder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/379775672&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
              </div>
          </ResizePanel>
        </div>

        {/*<div className="md:hidden block" style={{width:'100%', height: '100%'}}>
          <iframe srcDoc={getHtml(value)} className="container" style={{minHeight:170, maxHeight:350}} scrolling="no" frameBorder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/379775672&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
        </div>*/}

      </div>
    </div>
  )
}
