import React, {useState} from "react";


export const Filter = (props) => {
    const {selectedFilter, handleFilterChange} = props;

    return (
        // <div>
        //     <ul className="grid w-full gap-0 md:grid-cols-3">
        //         <li>
        //             <input type="radio" id="projects_filter_ALL" name="projects_filter_ALL" value="ALL" checked={selectedFilter === "ALL"} onChange={() => handleFilterChange("ALL")} className="hidden peer" required />
        //             <label htmlFor="projects_filter_ALL" className="inline-flex items-center justify-center w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
        //                 <div className="block">
        //                     <div className="w-full text-lg font-semibold">ALL</div>
        //                 </div>
        //             </label>
        //         </li>
        //         <li>
        //             <input type="radio" id="projects_filter_TODO" name="projects_filter_TODO" value="TODO" checked={selectedFilter === "TODO"} onChange={() => handleFilterChange("TODO")} className="hidden peer"/>
        //             <label htmlFor="projects_filter_TODO" className="inline-flex items-center justify-center w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
        //                 <div className="block">
        //                     <div className="w-full text-lg font-semibold">TODO</div>
        //                 </div>
        //             </label>
        //         </li>
        //         <li>
        //             <input type="radio" id="projects_filter_DONE" name="projects_filter_DONE" value="DONE" checked={selectedFilter === "DONE"} onChange={() => handleFilterChange("DONE")} className="hidden peer"/>
        //             <label htmlFor="projects_filter_DONE" className="inline-flex items-center justify-center w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
        //                 <div className="block">
        //                     <div className="w-full text-lg font-semibold">DONE</div>
        //                 </div>
        //             </label>
        //         </li>
        //     </ul>
        // </div>
        <div className="flex flex-wrap justify-center w-screen">
            <div className="inline-flex items-center mx-3">
                <label htmlFor="projects_filter_ALL" className="relative flex items-center p-3 rounded-full cursor-pointer">                           
                    <input type="radio" id="projects_filter_ALL" name="projects_filter_ALL" value="ALL" checked={selectedFilter === "ALL"} onChange={() => handleFilterChange("ALL")} 
                        className="before:content[''] relative peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-main-dark-color text-green-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-main-dark-color before:opacity-0 before:transition-opacity checked:border-green-500 checked:before:bg-green-500 hover:before:opacity-10" required />
                    <span className="absolute text-green-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                            <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                        </svg>
                    </span>
                </label>
                <div className="text-lg font-medium text-gray-900 dark:text-gray-300">ALL</div>
            </div>
            <div className="inline-flex items-center mx-3">
                <label htmlFor="projects_filter_TODO" className="relative flex items-center p-3 rounded-full cursor-pointer">                           
                    <input type="radio" id="projects_filter_TODO" name="projects_filter_TODO" value="TODO" checked={selectedFilter === "TODO"} onChange={() => handleFilterChange("TODO")} 
                        className="before:content[''] relative peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-main-dark-color text-green-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-main-dark-color before:opacity-0 before:transition-opacity checked:border-green-500 checked:before:bg-green-500 hover:before:opacity-10" required />
                    <span className="absolute text-green-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                            <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                        </svg>
                    </span>
                </label>
                <div className="text-lg font-medium text-gray-900 dark:text-gray-300">TODO</div>
            </div>
            <div className="inline-flex items-center mx-3">
                <label htmlFor="projects_filter_DONE" className="relative flex items-center p-3 rounded-full cursor-pointer">                           
                    <input type="radio" id="projects_filter_DONE" name="projects_filter_DONE" value="DONE" checked={selectedFilter === "DONE"} onChange={() => handleFilterChange("DONE")} 
                        className="before:content[''] relative peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-main-dark-color text-green-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-main-dark-color before:opacity-0 before:transition-opacity checked:border-green-500 checked:before:bg-green-500 hover:before:opacity-10" required />
                    <span className="absolute text-green-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                            <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                        </svg>
                    </span>
                </label>
                <div className="text-lg font-medium text-gray-900 dark:text-gray-300">DONE</div>
            </div>
  
        </div>
    )
}

export default Filter;