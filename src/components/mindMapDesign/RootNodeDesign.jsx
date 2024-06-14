import { Handle, Position } from 'reactflow';

// Nodeの見た目を調整する

export default function RootNodeDesign({ id, data }) {
    return (
      <>
        {/* <div className='flex flex-col bg-orange-300'>
          <input defaultValue={data.label} className="bg-white rounded-md border border-gray-900 mx-1 my-1 px-2 py-1 font-semibold"/>
        
          <button type='button' className='bg-slate-400'>button</button>
        </div> */}

        {/* 新UI */}
        <div className="dragHandle relative flex items-center justify-center">
          <input type="checkbox" className="absolute left-0 rounded-full ml-2" />
          <div className="bg-white rounded-full p-6 w-72 h-72 flex flex-col justify-center items-center">
            <div className="font-semibold text-5xl text-orange-300 text-center">{data.taskName}</div>
            <div className="text-2x1 text-orange-300 text-center">{data.deadline}</div>
          </div>
        </div>


        {/*  */}

        {/* HandleとはEdgeを生やす点 */}
        {/* <Handle type="target" position={Position.Top} /> */}
        <Handle type="source" position={Position.Bottom} />
      </>
        
    );
  }
   
