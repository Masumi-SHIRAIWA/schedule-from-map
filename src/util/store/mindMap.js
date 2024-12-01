import {
    applyNodeChanges,
    applyEdgeChanges, // ノードとエッジの変化を渡し、
  } from 'reactflow';
import { createWithEqualityFn } from "zustand/traditional";
import { nanoid } from 'nanoid'; // nanoid: randomなIDを生成する関数
  
import convertISOToDateString from "@/util/dateConverter"; // ISOのString型をDate(YYYY-MM-DD)型のString型にする


//   Storeの定義
  const useMindMapStore = createWithEqualityFn((set, get) => ({
    // Projectのテーマカラー指定
    colorId: 0, // string
    
    // ノード・エッジ状態の初期設定
    nodes: [],
    edges: [],

    // アクション
    // 各プロジェクトページが読み込まれたときに、useEffectでStoreに挿入するアクション
    setColorId: (NewColorId) => {set({ colorId: NewColorId })},
    setNodes: (newNodes) => {set({ nodes: newNodes })},
    setEdges: (newEdges) => {set({ edges: newEdges })},
    addNewNode: (newNode) => {set({ nodes: [...get().nodes, newNode]})},
    addNewEdge: (newEdge) => {set({ edges: [...get().edges, newEdge]})},

    // ノードのデータ(name, deadline, done)が変わったときのアクション
    updateNode: (id, newName, newDeadline, newDone) => {
      const idx = get().nodes.findIndex(node => node.id === id);
      if (idx !== -1){
        set({ nodes : [
          ...get().nodes.slice(0,idx),
          {...get().nodes[idx],
            data: { 
              taskName: newName,
              deadline : convertISOToDateString(newDeadline), 
              done: newDone,
            },
          },
          ...get().nodes.slice(idx + 1),
        ]})
      }else{
        console.log("IDが不明です (in stor/mindMap.js store) ")
      }

    },

    // ノードが変わったときのアクション ReactFlowのプロパティにそのまま突っ込む
    // ノードのDeleteにも対応してる。→
    onNodesChange: (changes) => {
      // console.log(get().nodes)
      // console.log("onNODESChange!!!!!!!")
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
        // console.log(get().nodes)

      },

    // エッジが変わったときのアクション
    onEdgesChange: (changes) => {
      console.log(changes)
      console.log(get().edges)
      console.log("onEdgesChange!!!!!!!")
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      console.log(get().edges)
      },

    // ノードを追加するアクション

  }));
  
  export default useMindMapStore;