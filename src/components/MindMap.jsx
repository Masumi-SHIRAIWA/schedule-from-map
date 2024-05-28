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
    type: "mindmap",
    data: { label: task.name },
    position: {x: task.x, y: task.y},
    
  }));
  return nodes;
}
// エッジの初期化．Tasksから親と子の関係を取得し作成する
function initializeEdges(tasks){}

const initialEdges = [];

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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState(null)

  const connectingNodeId = useRef(null); //
  const store = useStoreApi(); // React Flowの"ストア"にアクセスするカスタムフックの1つ
  // React Flowのストアには、ノードやエッジ、ペインなどの重要な情報が含まれている
  const { screenToFlowPosition } = useReactFlow(); // React Flowの"コンポーネント"のプロパティや状態，イベントにアクセスできる．


  // ノードの追加：Tasks Stateにも追加
  const addNode = (e) => {
    e.preventDefault();
    const ownIds = [];
    // for 
    
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
        type: "mindmap",
      })
    );

  };

  
  // エッジを伸ばして子ノードを作成
  const addChildNode = (parentNode, childNodePosition) => {
    const ownId = (nodes.length + 1);
    const position = childNodePosition;
    const deadline = null; // この追加の場合，Deadlineをどう決めるか

    setNodes((prevNodes) =>
      prevNodes.concat({
        id: ownId.toString(),
        data: { label: "NewTask" },
        position,
        type: "mindmap",
      })
    );

    // setEdges((prevEdges) => 
    //   prevEdges.concat({
    //     id: ,
    //     source: parentNode.id,
    //     target: newNode.id,
    //   })
    // );

    // Tasks Stateにも追加
    setTasks((prevTasks) => 
      prevTasks.concat({
        id: null,
        name: "NewTask",
        done: false,
        deadline: deadline,
        projectId: projectId, // 変更
        x: childNodePosition.x,
        y: childNodePosition.y,
        ownId: ownId,
        parentId: parentNode.id, // 変更
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
    console.log(panePosition.x, )
  
    return { // Drugした場所 = 新ノードの位置
      x: panePosition.x, // - parentNode.positionAbsolute.x + parentNode.width / 2,
      y: panePosition.y, // - parentNode.positionAbsolute.y + parentNode.height / 2,
    };
  };

  // onConnect：ノード間にエッジ（接続）が追加されたときに呼ばれるコールバック関数
  // コールバックとして定義し無駄なレンダリングを防ぐ
  const onConnect = useCallback(
    (params) => {
      console.log("params: ", params);
      setEdges((edges) => addEdge(params, edges));
    
    },
    [setEdges]
  );

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
    console.log(targetIsPane)


    if (targetIsPane && connectingNodeId.current) {
      console.log("in connected node id",connectingNodeId.current)
      const parentNode = nodeInternals.get(connectingNodeId.current);
      const childNodePosition = getChildNodePosition(event, parentNode);

      if (parentNode && childNodePosition) {
        addChildNode(parentNode, childNodePosition);
      }
    }
  }, [getChildNodePosition])

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