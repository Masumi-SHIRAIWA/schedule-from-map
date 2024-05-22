import { Handle, Position } from 'reactflow';

// Nodeの見た目を調整する

export default function NodesDesign({ id, data }) {
    return (
      <>
        <div className='flex flex-col bg-orange-300'>
          <input defaultValue={data.label} className="bg-white rounded-md border border-gray-900 mx-1 my-1 px-2 py-1 font-semibold"/>
        
          <button type='button' className='bg-slate-400'>button</button>
        </div>
        
        {/* HandleとはEdgeを生やす点 */}
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </>
        
    );
  }
   
