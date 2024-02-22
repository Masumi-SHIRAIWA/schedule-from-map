import React, { useState } from 'react';

export const ProjectOverview = (props) => {

    const {project, onCheck} = props;

    const handleChange = () => {
        onCheck(project);
    }

    return (
        <label className="flex items-center mb-4">
        <input
            type="checkbox"
            checked={project.done}
            onChange={handleChange}
            className="mr-2"
        />
        <span
            // className={classNames('text-gray-500', {
            // 'line-through': project.done
            // })}
        >
            {project.name}
        </span>
        </label>
    )

}

export default ProjectOverview;