// 個別のプロジェクトのページ．

import { useRouter } from "next/router";


const Project = (props) => {

    const router = useRouter();
    const {id} = router.query;

    return <div className={`min-h-screen`}>{id}</div>

    
};

export default Project;