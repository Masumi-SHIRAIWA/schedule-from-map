import FullCalendar from '@fullcalendar/react';
// FullCalendarで月表示を可能にするプラグイン。
import dayGridPlugin from '@fullcalendar/daygrid';
// FullCalendarで日付や時間が選択できるようになるプラグイン。
import interactionPlugin from "@fullcalendar/interaction";
//日本語対応のためのインポート
import jaLocale from "@fullcalendar/core/locales/ja";


// MindMap のZustandでの管理
import useMindMapStore from "@/util/store/mindMap";
// Tasks のZustandでの管理
import useTasksStore from '@/util/store/tasks';
import { shallow } from 'zustand/shallow';
import { useEffect, useState } from 'react';

import convertISOToDateString from "@/util/dateConverter"; // ISOのString型をDate(YYYY-MM-DD)型のString型にする
import { theme_colors, done_colors } from '@/util/colors'; // theme_colorをJSファイルから利用する


const Calendar = () => {
    
    // zUstandでのステート管理
  const {colorId, nodes, edges, setNodes, setEdges, addNewNode, addNewEdge, onNodesChange, onEdgesChange} = useMindMapStore(
    (state) => ({
      colorId: state.colorId,
      nodes: state.nodes,
      edges: state.edges,
      setNodes: state.setNodes,
      setEdges: state.setEdges,
      addNewNode: state.addNewNode,
      addNewEdge: state.addNewEdge,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
    }),
    shallow
  );

  // ローカルステートでeventsを管理
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // console.log("rendering!!")
    const newEvents = nodes.map(node => ({
      title: node.data.taskName,
      textColor: node.data.done ? done_colors.text : "white",
      start: node.data.deadline,
      backgroundColor: node.data.done ? done_colors.backGround : theme_colors[colorId],
      borderColor: node.data.done ? done_colors.backGround : theme_colors[colorId],
    }));
    setEvents(newEvents);
  }, [nodes]);

  

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      locales={[jaLocale]}
      locale="ja"
      weekends={true} // falseにすると土日が含まれなくなるdefault値がtrueなので省略可
      displayEventTime={false} // 時間表示を無効にする
      headerToolbar={{
        start: "today",
        center: "title",
        end: "prev next"
      }}
      contentHeight={"500px"}
    />
  );
}

export default Calendar;
