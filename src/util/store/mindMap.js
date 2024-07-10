import {
    applyNodeChanges,
    applyEdgeChanges, // ノードとエッジの変化を渡し、
  } from 'reactflow';
import { createWithEqualityFn } from "zustand/traditional";
import { nanoid } from 'nanoid'; // nanoid: randomなIDを生成する関数
  
//   Storeの定義
  const useMindMapStore = createWithEqualityFn((set, get) => ({
    
    // ノード・エッジ状態の初期設定
    nodes: [],
    edges: [],

    // アクション
    // 各プロジェクトページが読み込まれたときに、useEffectでStoreに挿入するアクション
    setNodes: (newNodes) => {set({ nodes: newNodes })},
    setEdges: (newEdges) => {set({ edges: newEdges })},
    addNewNode: (newNode) => {set({ nodes: [...get().nodes, newNode]})},
    addNewEdge: (newEdge) => {set({ edges: [...get().edges, newEdge]})},

    // ノードが変わったときのアクション ReactFlowのプロパティにそのまま突っ込む
    onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },

    // エッジが変わったときのアクション
    onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },

    // ノードを追加するアクション

  }));
  
  export default useMindMapStore;