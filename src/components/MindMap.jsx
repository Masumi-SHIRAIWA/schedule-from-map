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
    getIncomers,
    getOutgoers,
    getConnectedEdges,
  } from "reactflow";
import "reactflow/dist/style.css";

// Nodeのカスタム用．ReactFlowにプロパティとして渡す
// import TextUpdaterNode from './TextUpdaterNode';
import NodesDesign  from "./mindMapDesign/NodesDesign";
import RootNodeDesign from "./mindMapDesign/RootNodeDesign";
// Edgeのカスタム用．ReactFlowにプロパティとして渡す
import EdgesDesign  from "./mindMapDesign/EdgesDesign";
import { theme_colors, done_colors } from '@/util/colors'; // theme_colorをJSファイルから利用する

import convertISOToDateString from "@/util/dateConverter"; // ISOのString型をDate(YYYY-MM-DD)型のString型にする
// MindMap のZustandでの管理
import useMindMapStore from "@/util/store/mindMap";
// Tasks のZustandでの管理
import useTasksStore from '@/util/store/tasks';
import { shallow } from 'zustand/shallow';
import { Tektur } from "next/font/google";

// ------------------------- END of import part -------------------------

// Nodeリストの初期化関数
function initializeNodes(tasks){
  const nodes = tasks.map(task=> ({
    id: task.nodeId.toString(),
    type: task.rootNode ? "root" : "mindmap", // もし，Rootタスクなら"root"
    data: { 
      taskName: task.name,
      deadline : convertISOToDateString(task.deadline), 
      done: task.done,
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
    source: task.parentNodeId ? task.parentNodeId.toString() : null,
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


// // onLoad関数：ReactFlowにプロパティとして渡す
const onLoad = (reactFlowInstance) => {
// fitView: すべてのノードとエッジが表示されるようにビューを調整する
// グラフ全体がコンポーネントのビューポート内に収まるよう
  reactFlowInstance.fitView();
};

// MindMap Component
export default function MindMap({ projectId, projectColor}) {
  
  // console.log("ここが毎回呼び出される")
  // zUstandでのステート管理
  const {colorId, nodes, edges, setColorId, setNodes, setEdges, addNewNode, addNewEdge, onNodesChange, onEdgesChange} = useMindMapStore(
    (state) => ({
      colorId: state.colorId,
      nodes: state.nodes,
      edges: state.edges,
      setColorId: state.setColorId,
      setNodes: state.setNodes,
      setEdges: state.setEdges,
      addNewNode: state.addNewNode,
      addNewEdge: state.addNewEdge,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
    }),
    shallow
  );
  const {tasks, setTasks, addNewTask, removeTask} = useTasksStore(
    (state) => ({
        tasks: state.tasks,
        setTasks: state.setTasks,
        addNewTask: state.addNewTask,
        removeTask: state.removeTask,
    }),
    shallow
    );
  // 初期レンダリング時の処理
  useEffect(() => {
    setColorId(projectColor)
    console.log("MindMap Tasks", tasks)
    const initialNodes = initializeNodes(tasks);
    const initialEdges = initializeEdges(tasks);
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [tasks])
  // console.log(tasks)
  // console.log(nodes)
  // console.log(edges)

  // 独自のステート管理
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState(null) // データ型はどうする？DateのStringか、'Y-M-D'のStringか


  const connectingNodeId = useRef(null); //
  const store = useStoreApi(); // React Flowの"ストア"にアクセスするカスタムフックの1つ
  // React Flowのストアには、ノードやエッジ、ペインなどの重要な情報が含まれている
  const { screenToFlowPosition } = useReactFlow(); // React Flowの"コンポーネント"のプロパティや状態，イベントにアクセスできる．

  // エッジを伸ばして子ノードを作成
  const addChildNode = (parentNode, childNodePosition) => {
    const nodeIds = nodes.map(node => parseInt(node.id, 10));
    var nodeId = Math.max(...nodeIds) + 1;
    const edgeIds = edges.map(edge => parseInt(edge.id, 10));
    var edgeId = 0;
    if(edgeIds.length){ edgeId = Math.max(...edgeIds) + 1; }

    const position = childNodePosition;
    const taskName = "NewTask";
    const deadline = new Date().toISOString(); // とりあえず今日のDate型

    addNewNode({
      id: nodeId.toString(),
      data: { 
        taskName: taskName,
        deadline: convertISOToDateString(deadline),
        done: false,
      },
      position,
      type: "mindmap",
      dragHandle: '.dragHandle',
    })

    addNewEdge({
      id: edgeId.toString(),
      source: parentNode.id,
      target: nodeId.toString(),
    })

    addNewTask({
      id: null,
      name: taskName,
      done: false,
      deadline: deadline,
      projectId: projectId, // 変更
      x: childNodePosition.x,
      y: childNodePosition.y,
      nodeId: nodeId,
      rootNode: false,
      parentNodeId: parseInt(parentNode.id), // 変更
      type: "NEW"
    })
  
  }

  // ノードの削除：nodesから削除．Tasks StateのTypeを”DEL"に 
  const onNodesDelete = useCallback((deleted)=>{    
    setEdges(
      deleted.reduce((allEdges, node) => { // 消去前の全てのエッジ、消去されたノード
        const incomers = getIncomers(node, nodes, edges); //削除されたエッジの親となっているノード(複数)
        const incomer = incomers.length > 0 ? incomers[0] : None; // Noneになるのは、Rootノードが消えたとき
        const outgoers = getOutgoers(node, nodes, edges); //削除されたノードの子となっているノード(複数)
        const connectedEdges = getConnectedEdges([node], edges); // 消去したノードに繋がってたエッジ(＝消去済みエッジ)を取得
        // resumainingEdgesという新しいエッジの配列を作成する。この配列には、削除したノードとは関係のない、フロー内のすべてのエッジが含まれる。
        const remainingEdges = allEdges.filter(
          (edge) => !connectedEdges.includes(edge),
        );

        const updatedEdges = connectedEdges.filter((edge) => edge.source==node.id)
        const createdEdges = updatedEdges.map((edge)=>({
          ...edge,
          source: incomer.id
        }))

        const delTasks = tasks.filter(task => 
          task.nodeId == parseInt(node.id)
        )
        for (const delTask of delTasks){
          if (delTask.type == "NEW"){
            removeTask(delTask.id)
          }
        }

        return [...remainingEdges, ...createdEdges];
      }, edges),
    );

    // delTask = tasks.filter(task => ({
    //   task.nodeId ==
    // }))
    
  },[nodes, edges]);

  // MAPの状態を保存（DBに反映）
  const saveChange = async (e) => {
    e.preventDefault();
    // ルートノードの更新用
    var rootNodeDoneChanged = false;
    var projectDone;
    // nodes State を元に tasks Stateの更新
    const tasksMap = new Map(tasks.map(obj => [obj.nodeId, obj])); // TasksをNodeIDで検索できるように
    // Nodesの更新確認
    for (const node of nodes) {
      const taskTemp = tasksMap.get(parseInt(node.id));
      if(taskTemp.rootNode && taskTemp.done != node.data.dnoe){
        rootNodeDoneChanged = true;
        projectDone = node.data.done;
      }
    
      // Deadlineの確認。nodeのDeadlineをDate型Stringにして確認する
      const pareseNodeDeadline = new Date(node.data.deadline).toISOString()
      tasksMap.set(parseInt(node.id), {
        ...taskTemp,
        name: node.data.taskName,
        deadline: pareseNodeDeadline,
        done: node.data.done,
        x: node.position.x,
        y: node.position.y,
        type: taskTemp.type == "NEW" ? "NEW" : "EXISTING"
      })
    }
    // 削除したNodesの更新確認
    const nodesIds = new Set(nodes.map(node => node.id)); // Nodes の ID を Set に変換
    const deletedTaskKeys = [...tasksMap.keys()].filter(key => !nodesIds.has(String(key)));

    console.log(deletedTaskKeys)
    for (const id of deletedTaskKeys){
      const taskTemp = tasksMap.get(id);
      tasksMap.set(id, {
        ...taskTemp,
        type: "DELETE"
      })
    }
    // 削除したEdgesの更新確認
    // const deletedEdges = edges.filter(edge => !tasksMap.has(parseInt(edge.target)))
    // Edgesの保存
    for(const edge of edges) {
      tasksMap.set(parseInt(edge.target), {
        ...tasksMap.get(parseInt(edge.target)),
        parentNodeId: parseInt(edge.source),
      })
    }
    var newTasks = Array.from(tasksMap.entries()).map(([key, value]) => ({ id: key, ...value })); 

    // API（updateTask）呼び出し
    try{
      // task の更新
      let result = await fetch('/api/updateTask' , {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({tasks: newTasks})
      });
      console.log(result);
      // project の更新
      if (rootNodeDoneChanged){
        result = await fetch('/api/updateProject' , {
          method: 'POST',
          headers: { 'Content-Type' : 'application/json'},
          body: JSON.stringify({id: projectId, done: projectDone})
        });
      }
      
    } catch (e) {
      console.log(e);
    }
    
    newTasks = newTasks.filter((task) => task.type != "DELETE")
    newTasks = newTasks.map(task => ({
      ...task,
      type: "EXISTING"
    }))
    setTasks(newTasks)
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
    
    const edgeIds = edges.map(edge => parseInt(edge.id, 10));
    var edgeId = 0;
    if(edgeIds.length){ edgeId = Math.max(...edgeIds) + 1; }
    addNewEdge({
      id: edgeId.toString(),
      source: params.source,
      target: params.target,
    })

    setTasks(tasks.map(task => {
      if(task.id == parseInt(params.target)){
        task.parentNodeId = parseInt(params.source)
        task.type = "UPDATE"
      };
      return task;
    }))


  }, [edges, setEdges]);

  const onConnectStart = useCallback((_, {nodeId}) => {
    // console.log("in onConnectStart, _ : ", _);
    // console.log("in onConnectStart, nodeId : ", nodeId);
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
      <div className="flex justify-left">
          <button
          type="button"
          onClick={saveChange}
          className={`ml-2 px-4 py-2 bg-main-dark-color text-white rounded-md hover:bg-hovor-dark-color `}
          >SAVE CHANGE</button>
      </div>
      <ReactFlow 
          // Node
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onNodesDelete={onNodesDelete}
          nodeOrigin= {[0.5, 0.5]} // ノードの原点を指定

          // Edge
          edges={edges}
          edgeTypes={edgeTypes}
          onEdgesChange={onEdgesChange}
          // connectionLineStyle={connectionLineStyle} // 接続前
          // defaultEdgeOptions={defaultEdgeOptions} // 接続後
          // connectionLineType={ConnectionLineType.Straight} // 接続前のエッジの形を制御
          // ConnectionLineType.Bezier: 曲線の接続ライン(default)
          // ConnectionLineType.Straight: 直線の接続ライン
          // ConnectionLineType.Step: 階段状の接続ライン
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}


          // onLoad={onLoad}
          fitView = {true}

          className="flex-grow h-100 w-100">

          <Controls />
      </ReactFlow>
    </div>

  );
}