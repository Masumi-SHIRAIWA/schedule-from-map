import FullCalendar from '@fullcalendar/react';
// FullCalendarで月表示を可能にするプラグイン。
import dayGridPlugin from '@fullcalendar/daygrid';
// FullCalendarで日付や時間が選択できるようになるプラグイン。
import interactionPlugin from "@fullcalendar/interaction";
//日本語対応のためのインポート
import jaLocale from "@fullcalendar/core/locales/ja";

const Calender = ({taskList}) => {
    const tasks = taskList.map(task => ({
            title: task.name,
            start: new Date(task.deadline).toISOString(),
            backgroundColor: task.done ? "gray" : "orange",
            
        })
    )

    return (
        <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={tasks}
            weekends={true} //falseにすると土日が含まれなくなるdefault値がtrueなので省略可
                
            //以下を追加
            headerToolbar={{
                start: "today",
                    center: "title",
                    end: "prev next"
                    }}
            contentHeight={"500px"}
            
            
        ></FullCalendar>
    )


}

export default Calender