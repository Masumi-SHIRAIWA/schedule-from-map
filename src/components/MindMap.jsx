import { Result } from "postcss";
import React, { useState, useCallback, useEffect, useRef } from "react";
import ReactFlow, {
    MiniMap,
    Controls,
    useNodesState,
    useEdgesState,
    addEdge,
    ConnectionLineType,
    useStoreApi,
    useReactFlow,
    nodeOrigin,
  } from "reactflow";
import "reactflow/dist/style.css";

// Nodeのカスタム用．ReactFlowにプロパティとして渡す
// import TextUpdaterNode from './TextUpdaterNode';
import NodesDesign  from "./mindMapDesign/NodesDesign";
import RootNodeDesign from "./mindMapDesign/RootNodeDesign";
// Edgeのカスタム用．ReactFlowにプロパティとして渡す
import EdgesDesign  from "./mindMapDesign/EdgesDesign";

// ------------------------- END of import part -------------------------

//  ------------------------- Contents of Each state (Nodes, Edges, Tasks)   -------------------------
// Nodes [
//   {
//     id: "1",
//     type: "input",
//     data: { 
        //   taskName: "Root Task" 
        //   deadline: "2024-05-20"
        // },
//     position: { x: 0, y: 0 },
//   },
//   { },
// ];
// Edges [
//   {
//     id: "1",
//     source: "2",
//     target: "5",
//   },
//   { }
// ];
// Tasks [
//   {
//     ...task,
//     type: "NEW" or "UPDATE" or "EXISTING" or "DELETE"
//   }
// ]

// Nodeリストの初期化関数
function initializeNodes(tasks){
  const nodes = tasks.map(task=> ({
    id: task.nodeId.toString(),
    type: task.rootNode ? "root" : "mindmap", // もし，Rootタスクなら"root"
    data: { 
      taskName: task.name,
      deadline : task.deadline, 
    },
    position: {x: task.x, y: task.y},
    dragHandle: '.dragHandle',
    
  }));
  return nodes;
}
// エッジの初期化．Tasksから親と子の関係を取得し作成する
function initializeEdges(tasks){
  const edges = tasks.map((task, index) => ({
    id: index.toString(),
    source: task.parentId ? task.parentId.toString() : null,
    target: task.nodeId.toString(),
  })).filter(edge => edge.target !== null);
  
  return edges;
}

// NodeとEdgeの見た目を変える．mindMapDesign内のComponentで設定した見た目にする
const nodeTypes = {
  mindmap: NodesDesign,
  root: RootNodeDesign,
};
const edgeTypes = {
  mindmap: EdgesDesign,
};

// エッジが実際に確定する前に表示されるラインのスタイル(色・幅)を制御
const connectionLineStyle = { stroke: '#FFAA11', strokeWidth: 3};

// 新しいエッジが確定されたときに適用されるデフォルトのオプションを指定
const defaultEdgeOptions = { style: { stroke: '#FFAA11', strokeWidth: 3 } , type: 'mindmap'};


// onLoad関数：ReactFlowにプロパティとして渡す
const onLoad = (reactFlowInstance) => {
// fitView: すべてのノードとエッジが表示されるようにビューを調整する
// グラフ全体がコンポーネントのビューポート内に収まるよう
  reactFlowInstance.fitView();
};

// MindMap Component
export default function MindMap({taskList, projectId}) {

  // 初期レンダリング時の処理
  useEffect(() => {
    // DBからTaskを取得・Type属性の追加（DB反映時に使用）
    taskList = taskList.map(task => ({
      ...task,
      type: "EXISTING"
    }))
    console.log("初期レンダリング：", taskList);
  }, [])

  // 独自のステート管理
  const [tasks, setTasks] = useState(taskList);
  const initialNodes = initializeNodes(tasks);
  const initialEdges = initializeEdges(tasks);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState(null)

  const connectingNodeId = useRef(null); //
  const store = useStoreApi(); // React Flowの"ストア"にアクセスするカスタムフックの1つ
  // React Flowのストアには、ノードやエッジ、ペインなどの重要な情報が含まれている
  const { screenToFlowPosition } = useReactFlow(); // React Flowの"コンポーネント"のプロパティや状態，イベントにアクセスできる．


  // ノードの追加：Tasks Stateにも追加 (削除予定)
  const addNode = (e) => {
    e.preventDefault();
    console.log(typeof(deadline))

    const nodeIds = nodes.map(node => parseInt(node.id, 10));
    const nodeId = Math.max(...nodeIds) + 1;

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    setNodes((prevNodes) =>
      prevNodes.concat({
        id: nodeId.toString(),
        data: { 
          taskName: taskName,
          deadline: deadline,
        },
        position: {
          x: x,
          y: y,
        },
        type: "mindmap",
        dragHandle: '.dragHandle',
      })
    );

  };

  // エッジを伸ばして子ノードを作成
  const addChildNode = (parentNode, childNodePosition) => {
    const nodeIds = nodes.map(node => parseInt(node.id, 10));
    const nodeId = Math.max(...nodeIds) + 1;
    const edgeIds = edges.map(edge => parseInt(edge.id, 10));
    var edgeId = 0;
    if(edgeIds.length){ edgeId = Math.max(...edgeIds) + 1; }

    const position = childNodePosition;
    const taskName = "NewTask";
    const deadline = "2024-05-30"; // この追加の場合，Deadlineをどう決めるか

    setNodes((prevNodes) =>
      prevNodes.concat({
        id: nodeId.toString(),
        data: { 
          taskName: taskName,
          deadline: deadline
        },
        position,
        type: "mindmap",
        dragHandle: '.dragHandle',
      })
    );

    setEdges((prevEdges) => 
      prevEdges.concat({
        id: edgeId.toString(),
        source: parentNode.id,
        target: nodeId.toString(),
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
        x: childNodePosition.x,
        y: childNodePosition.y,
        nodeId: nodeId,
        rootNode: false,
        parentId: parseInt(parentNode.id), // 変更
        type: "NEW"
      })
    );
  
  }

  // ノードの削除：nodesから削除．Tasks StateのTypeを”DEL"に 
  const delNode = () => {
    // nodes.del()
    // task.type = "DEL";
  };

  // MAPの状態を保存（DBに反映）
  const saveChange = async (e) => {
    e.preventDefault();

    // nodes State を元に tasks Stateの更新
    const tasksMap = new Map(tasks.map(obj => [obj.nodeId, obj]));
    for (const node of nodes) {
      const taskTemp = tasksMap.get(parseInt(node.id));
    // 既存のTaskであれば，更新されているか確認
      var updated = false;
      if (taskTemp.name != node.data.taskName){updated = true}
      if (taskTemp.deadline != node.data.deadline){updated = true}
      if (taskTemp.x != node.position.x){updated = true}
      if (taskTemp.y != node.position.y){updated = true}
      console.log(typeof(taskTemp.deadline), taskTemp.deadline)
      tasksMap.set(parseInt(node.id), {
        ...taskTemp,
        name: node.data.taskName,
        deadline: node.data.deadline,
        x: node.position.x,
        y: node.position.y,
        type: taskTemp.type == "NEW" ? "NEW" : updated ? "UPDATE" : "EXISTING" //"DEL"も追加
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

  // マウスの位置から，Nodeの位置を適切に割当てる．
  const getChildNodePosition = (event, parentNode) => { //(event=マウスイベント，親ノードの位置)
    const { domNode } = store.getState(); // React FlowのストアからdomNodeを取得
  
    if (
      !domNode ||
      !parentNode?.positionAbsolute ||
      !parentNode?.width ||
      !parentNode?.height
    ) {
      return;
    }
  
    const panePosition = screenToFlowPosition({ //マウスイベントの座標をReact Flowの座標に変換
      x: event.clientX,
      y: event.clientY,
    });
  
    return { // Drugした場所 = 新ノードの位置
      x: panePosition.x, // - parentNode.positionAbsolute.x + parentNode.width / 2,
      y: panePosition.y, // - parentNode.positionAbsolute.y + parentNode.height / 2,
    };
  };

  // onConnect：ノード間にエッジ（接続）が追加されたときに呼ばれるコールバック関数
  // コールバックとして定義し無駄なレンダリングを防ぐ
  const onConnect = useCallback((params) => {
      setEdges(edges.filter((edge) => edge.target != params.target));
      setEdges((edges) => addEdge(params, edges));

      setTasks(tasks.map(task => {
        if(task.id == parseInt(params.target)){
          task.parentId = parseInt(params.source)
          task.type = "UPDATE"
        };
        return task;
      }))


    }, [setEdges]);

  const onConnectStart = useCallback((_, {nodeId}) => {
    console.log("in onConnectStart, _ : ", _);
    console.log("in onConnectStart, nodeId : ", nodeId);
    connectingNodeId.current = nodeId;
  }, [])

  const onConnectEnd = useCallback((event) => {
    console.log("onConnectEnd, event: ", event);
    const {nodeInternals} = store.getState(); // React Flow上のノード情報を得る．
    
    // 接続がパネル上で終了した場合のみ
    const targetIsPane = event.target.classList.contains('react-flow__pane');
    if (targetIsPane && connectingNodeId.current) {
      console.log("create a edge from ", connectingNodeId.current)
      const parentNode = nodeInternals.get(connectingNodeId.current);
      const childNodePosition = getChildNodePosition(event, parentNode);

      if (parentNode && childNodePosition) {
        addChildNode(parentNode, childNodePosition);
      }
    }
  }, [getChildNodePosition])

  return (
    <div id="container" className="flex flex-col w-full h-full ">
      {/* <form onSubmit={addNode} className='mb-4 space-y-3'>
          <input type='text' id='taskNameForm'  onChange={(e) => {setTaskName(e.target.value)}} className="w-full border px-4 py-2 rounded-lg focus:outlin"/>
          <input type='date' id='deadlineForm'  onChange={(e) => {setDeadline(e.target.value)}} className="w-full border px-4 py-2 rounded-lg focus:outlin"/>
          <input type="submit" value="ADD A TASK" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"/>
      </form> */}

      <div className="flex justify-left">
          <button
          type="button"
          onClick={saveChange}
          className="ml-2 px-4 py-2 bg-orange-300 text-white rounded-md hover:bg-orange-400 focus:outline-none focus:ring focus:ring-blue-200"
          >SAVE CHANGE</button>
      </div>
      <ReactFlow 
          // Node
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          nodeOrigin= {[0.5, 0.5]} // ノードの原点を指定

          // Edge
          edges={edges}
          edgeTypes={edgeTypes}
          onEdgesChange={onEdgesChange}
          connectionLineStyle={connectionLineStyle} // 接続前
          defaultEdgeOptions={defaultEdgeOptions} // 接続後
          connectionLineType={ConnectionLineType.Straight} // 接続前のエッジの形を制御
          // ConnectionLineType.Bezier: 曲線の接続ライン(default)
          // ConnectionLineType.Straight: 直線の接続ライン
          // ConnectionLineType.Step: 階段状の接続ライン
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}


          onLoad={onLoad}
          fitView

          className="flex-grow h-100 w-100">

          <Controls />
          {/* <MiniMap
            nodeColor={(n) => {
              if (n.type === "input") return "blue";

              return "#FFCC00";
          }}
          /> */}
      </ReactFlow>
    </div>

  );
}