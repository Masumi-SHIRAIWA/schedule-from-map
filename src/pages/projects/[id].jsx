// 個別のプロジェクトのページ．
import { useRouter } from "next/router";
import prisma from "@/util/prisma";
import {ProjectIcons} from '@/components/projectIcons/ProjectIcons'

import MindMap from '@/components/MindMap'

// React Flow フックを使用するためにインポート
import { ReactFlowProvider } from 'reactflow';

// SSRの場合
export async function getServerSideProps(context){
    const { id } = context.params;

    // データベースからIDに関連するデータを取得
    // 1. Projectデータ
    const project = await prisma.project.findUnique({
        where: {
            id: parseInt(id),
        },
    });

    // Date型をStringに変換
    project.deadline = project.deadline.toISOString();

    // 2. Taskデータ
    const tasks = await prisma.task.findMany({
        where: {
            projectId: parseInt(id),
        },
    });

    // Date型をStringに変換
    const tasksWithoutDates = tasks.map(task => ({
        ...task,
        deadline: task.deadline.toISOString(), // Date型をISO 8601[文字列]に変換
    }));


    return {
        props: {
            project,
            tasks: tasksWithoutDates,
        },
    };
}

const Project = (props) => {
    console.log(props.project);
    console.log(props.tasks);

    return (

        <div className={`grid grid-rows-5 gap-0 w-screen h-screen`}>
            <div className="flex items-center px-10 w-full "> 
                <div className="flex-shrink-0">
                    <ProjectIcons className="h-14 w-14 fill-gray-500" type="book"/>
                </div>
                <div className="inline-block font-bold text-4xl text-gray-700 leading-10 mt-8 mb-8">{props.project.name}</div>
            </div>
            <div className="row-span-4 p-10 m-3  border border-gray-800 rounded-md">
                <ReactFlowProvider>
                    <MindMap taskList={props.tasks} projectId={props.project.id}/> 
                </ReactFlowProvider>
            </div>
        </div>

    )
    
};

export default Project;