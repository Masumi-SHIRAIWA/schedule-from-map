// 個別のプロジェクトのページ．
import { useRouter } from "next/router";
import prisma from "@/util/prisma";
import Image from 'next/image'

import MindMap from '@/components/MindMap'

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
        deadline: task.deadline.toISOString(), // Date型をISO 8601文字列に変換
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
                    <Image className="w-10 h-10 rounded-full" src="/favicon.ico" width="0" height="0"/>
                </div>
                <div className="inline-block font-bold text-2xl leading-10 mt-8 mb-8">Project: {props.project.name}</div>
            </div>
            <div className="row-span-4 p-10 m-10  border border-gray-800 rounded-md">
                <MindMap taskList={props.tasks} projectId={props.project.id}/> 
            </div>
        </div>

    )
    
};

export default Project;