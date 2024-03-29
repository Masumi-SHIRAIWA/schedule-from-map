// 個別のプロジェクトのページ．
import { useRouter } from "next/router";
import prisma from "@/util/prisma";
import Image from 'next/image'

// SSRの場合
export async function getServerSideProps(context){
    const { id } = context.params;

    // データベースからIDに関連するデータを取得
    const data = await prisma.projects.findUnique({
    where: {
        id: parseInt(id),
    },
    });

    return {
    props: {
        data,
    },
    };
}

const Project = (props) => {
    console.log(props.data)

    return (
        <div className={`min-h-screen`}>
                <div className="flex items-center px-10 w-full "> 
                            <div className="flex-shrink-0">
                    <Image className="w-10 h-10 rounded-full" src="/favicon.ico" width="0" height="0"/>
                </div>
                <div className="inline-block font-bold text-2xl leading-10 mt-8 mb-8">Project: {props.data.name}</div>
            </div>
            
        </div>
    )
    
};

export default Project;