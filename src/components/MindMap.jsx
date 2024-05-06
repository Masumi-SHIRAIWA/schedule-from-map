import { Result } from "postcss";
import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
    MiniMap,
    Controls,
    useNodesState,
    useEdgesState,
    addEdge,
  } from "reactflow";
import "reactflow/dist/style.css";

// const initialNodes = [
//   {
//     id: "1",
//     type: "input",
//     data: { label: "Root Task" },
//     position: { x: 0, y: 0 },
//   },{
//     id: "2",
//     type: "input",
//     data: { label: "Root Task" },
//     position: { x: 0, y: 0 },
//   },
// ];

// Nodeリストの初期化関数
function initializeNodes(tasks){
  const nodes = tasks.map(task=> ({
    id: task.ownId.toString(),
    type: "input",
    data: { label: task.name },
    position: {x: task.x, y: task.y},
    
  }));
  return nodes;
}

const initialEdges = [];

// onLoad関数：ReactFlowにプロパティとして渡す
const onLoad = (reactFlowInstance) => {
// fitView: すべてのノードとエッジが表示されるようにビューを調整する
  reactFlowInstance.fitView();
};

// MindMap Component
export default function MindMap({taskList, projectId}) {
  // DBからTaskを取得・Type属性の追加（DB反映時に使用）
  taskList = taskList.map(task => ({
    ...task,
    type: "EXISTING"
  }))
  // 独自のステート管理
  const [tasks, setTasks] = useState(taskList);
  console.log("更新され続けちゃってるよ！！！！")
  const initialNodes = initializeNodes(tasks);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState(null)

  // ノードの追加：Tasks Stateにも追加
  const addNode = (e) => {
    e.preventDefault();
    
    const ownId = (nodes.length + 1);
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    setNodes((prevNodes) =>
      prevNodes.concat({
        id: ownId.toString(),
        data: { label: `${taskName}` },
        position: {
          x: x,
          y: y,
        },
      })
    );

    // Tasks Stateにも追加
    setTasks((prevTasks) => 
      prevTasks.concat({
        id: null,
        name: taskName,
        done: false,
        deadline: deadline,
        projectId: projectId, // 変更
        x: x,
        y: y,
        ownId: ownId,
        parentId: null, // 変更
        type: "NEW"
      })
    );
    console.log(tasks)
    document.getElementById('taskNameForm').value=''; 
    document.getElementById('deadlineForm').value=''; 

  };

  // ノードの削除：nodesから削除．Tasks StateのTypeを”DEL"に 
  const delNode = () => {
    // nodes.del()
    // task.type = "DEL";
  };

  // MAPの状態を保存（DBに反映）
  const saveChange = async (e) => {
    e.preventDefault();

    // nodes State を元に tasks Stateの更新
    const tasksMap = new Map(tasks.map(obj => [obj.ownId, obj]));
    for (const node of nodes) {
      const taskTemp = tasksMap.get(parseInt(node.id));
      // 既存のTaskであれば，更新されているか確認
      var updated = false;
      if (taskTemp.name != node.data.label){updated = true}
      if (taskTemp.x != node.position.x){updated = true}
      if (taskTemp.y != node.position.y){updated = true}
      
      tasksMap.set(parseInt(node.id), {
        ...taskTemp,
        name: node.data.label,
        x: node.position.x,
        y: node.position.y,
        type: taskTemp.type == "NEW" ? "NEW" : updated ? "UPDATE" : "EXISTING"
      })
    }
    console.log("tasksMap: ", tasksMap);
    const newTasks = Array.from(tasksMap.entries()).map(([key, value]) => ({ id: key, ...value })); 
    setTasks(newTasks);

    // API（updateTask）呼び出し
    try{
      let result = await fetch('/api/updateTask' , {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({tasks: newTasks})
      });
      console.log(result);
    } catch (e) {
      console.log(e);
    }
    
    setTasks((prevTasks) => prevTasks.map(task => ({
      ...task,
      type: "EXISTING"
    })))

  }


    // コールバックとして定義し無駄なレンダリングを防ぐ
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div id="container" className="flex flex-col w-full h-full ">
      <form onSubmit={addNode} className='mb-4 space-y-3'>
          <input type='text' id='taskNameForm'  onChange={(e) => {setTaskName(e.target.value)}} className="w-full border px-4 py-2 rounded-lg focus:outlin"/>
          <input type='date' id='deadlineForm'  onChange={(e) => {setDeadline(e.target.value)}} className="w-full border px-4 py-2 rounded-lg focus:outlin"/>
          <input type="submit" value="ADD A TASK" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"/>
      </form>

      <div className="flex justify-center">
          <button
          type="button"
          onClick={saveChange}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
          >
          SAVE CHANGE
          </button>
      </div>
      <ReactFlow 
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onLoad={onLoad}
          className="flex-grow h-100 w-100">

          <Controls />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === "input") return "blue";

              return "#FFCC00";
          }}
          />
      </ReactFlow>
    </div>

  );
}