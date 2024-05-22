import { BaseEdge, getStraightPath } from 'reactflow';

// カスタムエッジコンポーネントであり、
// React Flowのデフォルトエッジコンポーネントを上書きするために使用
// エッジの見た目や "動作" を細かくカスタマイズすることが可能

export default function EdgesDesign(props) {
    const { sourceX, sourceY, targetX, targetY } = props;
 
    // 直線の定義
    const [edgePath] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
   
    return <BaseEdge path={edgePath} {...props}/>;
    // BaseEdgeコンポーネントを使用して直線のエッジを描画
  }
   
