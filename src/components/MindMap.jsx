import React, { useState, useCallback } from "react";
import ReactFlow, {
    MiniMap,
    Controls,
    useNodesState,
    useEdgesState,
    addEdge,
  } from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Root Task" },
    position: { x: 0, y: 0 },
  },
];

const initialEdges = [];

// onLoad関数：ReactFlowにプロパティとして渡す
const onLoad = (reactFlowInstance) => {
// fitView: すべてのノードとエッジが表示されるようにビューを調整する
  reactFlowInstance.fitView();
};

export default function MindMap() {
    // 独自のステート管理
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [name, setName] = useState("");

  const addNode = () => {
    setNodes((e) =>
      e.concat({
        id: (e.length + 1).toString(),
        data: { label: `${name}` },
        position: {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        },
      })
    );
  };

    // コールバックとして定義し無駄なレンダリングを防ぐ
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div id="container" className="flex flex-col w-full h-full ">
      <div className="flex justify-center">
          <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          name="title"
          className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button
          type="button"
          onClick={addNode}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
          >
          Add Node
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