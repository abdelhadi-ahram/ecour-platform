import React from 'react';
import LandingPageTopBar from './LandingPageTopBar';

export default function LandingPageRightPanel(props){

  return(
    <div className="w-full h-screen overflow-y-auto px-3 lg:px-0 lg:pr-8 flex flex-col">
        <div className="lg:w-[1/2] bg-gray-100 dark:bg-zinc-900 pt-4 pb-2 sticky top-0 lg:justify-center">
          <div>
            <LandingPageTopBar />
          </div>
        </div>

        <div className="py-3 px-2 flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:space-x-1 lg:grow lg:overflow-y-hidden">
          <div className="lg:w-3/4 md:shrink md:overflow-y-auto md:pr-2">
            <div className="w-full h-2 bg-gray-100 dark:bg-zinc-900 blur sticky top-0 "></div>
              <p className="dark:text-gray-300">
                Hna matalan ndiro fiha xi 7aja dyal Animation wkda...
              </p>
          </div>


          <div className="rounded-lg p-1 lg:w-1/4 md:grow-0">
            <p className="dark:text-gray-300">
              whna momkin n5liwh l notifications For example
            </p>
          </div>

        </div>

    </div>
  )
}
