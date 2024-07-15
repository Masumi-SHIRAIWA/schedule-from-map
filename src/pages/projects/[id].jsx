// 個別のプロジェクトのページ．
import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import prisma from "@/util/prisma";
import {ProjectIcons} from '@/components/projectIcons/ProjectIcons';

import MindMap from '@/components/MindMap';
import Calender from '@/components/Calender';

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
    const [windowSize, setWindowSize] = useState({height:null, width:null})
    console.log(props.project);
    console.log(props.tasks);
    useEffect(() => {
        // ウィンドウサイズを取得して状態を更新する関数
        const handleResize = () => {
          setWindowSize({
            height : window.innerHeight,
            width : window.innerWidth,
        });
        };
    
        // リサイズイベントリスナーを追加
        window.addEventListener('resize', handleResize);
    
        // 初期サイズを設定
        handleResize();
    
        // クリーンアップ関数でイベントリスナーを削除
        return () => window.removeEventListener('resize', handleResize);
      }, []); // 空の依存配列を使用することで、マウント時とアンマウント時にのみ実行される
    


    return (

        <div className="flex flex-col  min-w-screen min-h-screen p-5">
            <div className="flex flex-grow-0 items-center px-10"> 
                <div className="flex-shrink-0">
                    <ProjectIcons className="h-14 w-14 fill-gray-500" type="book"/>
                </div>
                <div className="inline-block font-bold text-4xl text-gray-700 leading-10 mt-8 mb-8">{props.project.name}</div>
                {windowSize.height},{windowSize.width}
            </div>
                {windowSize.width > 1300 ? (
                    <div className="flex flex-grow h-full w-full">
                      <div className="min-w-mindmap min-h-full flex-grow-5 p-10 m-3  border border-gray-800 rounded-md">
                        <ReactFlowProvider>
                          <MindMap taskList={props.tasks} projectId={props.project.id}/> 
                        </ReactFlowProvider>
                      </div>
                      <div className='flex-grow-2'>
                        <Calender taskList={props.tasks}/>
                      </div>
                    </div>):(
                      <div className='flex flex-col'>
                        <div className=" min-w-mindmap min-h-mindmap h-0  p-10 m-3  border border-gray-800 rounded-md">
                            <ReactFlowProvider>
                                <MindMap taskList={props.tasks} projectId={props.project.id}/> 
                            </ReactFlowProvider>
                        </div>
                        <Calender taskList={props.tasks}/>
                    </div>)
                }
            

        </div>

    )
    
};

export default Project;