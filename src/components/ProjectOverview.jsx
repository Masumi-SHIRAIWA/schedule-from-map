import React, { useState } from 'react';

export const ProjectOverview = (props) => {

    const {project, onCheck} = props;

    const handleChange = () => {
        onCheck(project);
    }

    return (
        <div class="flex items-center ps-3">
            
            <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                <input type="checkbox" value="" checked={project.done} onChange={handleChange} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                        {project.name}
            </label>
        </div>

    )

}

export default ProjectOverview;