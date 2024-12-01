import { createWithEqualityFn } from "zustand/traditional";

//   Storeの定義
const useTasksStore = createWithEqualityFn((set, get) => ({
    tasks : [],
    setTasks: (newtasks) => {set({ tasks: newtasks })},
    addNewTask: (newTask) => {set({ tasks: [...get().tasks, newTask]})},

      // タスクを1つ削除する関数
    removeTask: (taskId) => {
      const updatedTasks = get().tasks.filter(task => task.id !== taskId);
      set({ tasks: updatedTasks });
    },
  }));
  
  export default useTasksStore;