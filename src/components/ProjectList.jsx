import React, { useState } from 'react';
import ProjectOverview from "@/components/ProjectOverview";

export const ProjectList = () => {

    const [projects, setProjects] = useState([{key:0, name:"Project1", done:false},{key:1, name:"Project2", done:false}]);
    const [filter, setFilter] = useState("ALL");

    // // テキストファイルからProject一覧を取得する．
    // const getProjectList = () =>{

    // }

    
    // Filterの切り替え
    const handleFilterChange = value => setFilter(value);

    const displayProjects = projects.filter(project => {
        if (filter === "ALL")return true;
        if (filter === 'TODO') return !project.done;
        if (filter === 'DONE') return project.done;
    });

    const handleCheck = chekedProject =>{
        return null;
    }

    return (
        <div>
            <div>
                {
                    displayProjects.map(project => (
                        <ProjectOverview
                          project={project}
                          onCheck={handleCheck}/>
                    ))
                }
            </div>
        </div>
    )
    
}

export default ProjectList;