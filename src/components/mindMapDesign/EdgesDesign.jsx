import { BaseEdge, getStraightPath } from 'reactflow';
// MindMap のZustandでの管理
import useMindMapStore from "@/util/store/mindMap";
import { shallow } from 'zustand/shallow';

// カスタムエッジコンポーネントであり、
// React Flowのデフォルトエッジコンポーネントを上書きするために使用
// エッジの見た目や "動作" を細かくカスタマイズすることが可能

export default function EdgesDesign(props) {
  // zUstandでのステート管理
  const {colorId, updateNode} = useMindMapStore(
    (state) => ({
      colorId: state.colorId,
      updateNode: state.updateNode,
    }),
    shallow
  );

  const { sourceX, sourceY, targetX, targetY, style} = props;

  // 直線の定義
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  
  return <BaseEdge path={edgePath} {...props} />;
  // BaseEdgeコンポーネントを使用して直線のエッジを描画
}
   
