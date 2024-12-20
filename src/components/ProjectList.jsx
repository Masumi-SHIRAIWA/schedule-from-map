import React, { useState } from 'react';
import ProjectOverview from "@/components/ProjectOverview";
import Filter from "@/components/Filter";

export const ProjectList = (props) => {

    // 変える
    const [projects, setProjects] = useState(props.projects);
    const [filter, setFilter] = useState("TODO");
    
    // Filterの切り替え
    const handleFilterChange = value => setFilter(value);

    const displayProjects = projects.filter(project => {
        if (filter === "ALL")return true;
        if (filter === "TODO") return !project.done;
        if (filter === "DONE") return project.done;
    }).sort((a, b) => {
        // filterがALLの場合、project.doneがtrueのものを前にしてソートする
        if (filter === "ALL") {
            if (!a.done && b.done) {
                return -1;
            } else if (a.done && !b.done) {
                return 1;
            } else {
                return 0;
            }
        }
        return 0; // filterがALL以外の場合はソートしない
    });


    const handleCheck = checkedProject =>{
        // チェックがついたToDoのみ，真偽値(done)を変更
        const newList = projects.map(project => {
        if (project.id === checkedProject.id) {
            project.done = !project.done;
        }
        return project;
        });
        
        setProjects(newList);
    }

    return (
        <div>
            <div>
                <Filter 
                selectedFilter={filter}
                handleFilterChange={handleFilterChange}/>
            </div>          

            <div>
                {/* <ul className="max-w-lg divide-y divide-gray-400 dark:divide-gray-700"> */}
                {/* <div className='flex flex-wrap  align-top w-screen h-full px-16 py-8'> */}
                <div className='max-w-screen-2xl mx-auto  place-items-center w-screen h-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 px-16 py-8'>

                    {
                        displayProjects.map(project => (
                            <div key={project.id} className="w-full flex justify-center">
                                <ProjectOverview
                                project={project}
                                onCheck={handleCheck}/>
                            </div>
                        ))
                    }
                    
                </div>
            </div>
        </div>
    )
    
}

export default ProjectList;