import React, {useState} from "react";


export const Filter = (props) => {
    const {selectedFilter, handleFilterChange} = props;

    return (
        <div>
            <ul class="grid w-full gap-0 md:grid-cols-3">
                <li>
                    <input type="radio" id="projects_filter_ALL" name="projects_filter_ALL" value="ALL" checked={selectedFilter === "ALL"} onChange={() => handleFilterChange("ALL")} class="hidden peer" required />
                    <label for="projects_filter_ALL" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                        <div class="block">
                            <div class="w-full text-lg font-semibold">ALL</div>
                        </div>
                    </label>
                </li>
                <li>
                    <input type="radio" id="projects_filter_TODO" name="projects_filter_TODO" value="TODO" checked={selectedFilter === "TODO"} onChange={() => handleFilterChange("TODO")} class="hidden peer"/>
                    <label for="projects_filter_TODO" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                        <div class="block">
                            <div class="w-full text-lg font-semibold">TODO</div>
                        </div>
                    </label>
                </li>
                <li>
                    <input type="radio" id="projects_filter_DONE" name="projects_filter_DONE" value="DONE" checked={selectedFilter === "DONE"} onChange={() => handleFilterChange("DONE")} class="hidden peer"/>
                    <label for="projects_filter_DONE" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                        <div class="block">
                            <div class="w-full text-lg font-semibold">DONE</div>
                        </div>
                    </label>
                </li>
            </ul>
        </div>
    )
}

export default Filter;