import { createWithEqualityFn } from "zustand/traditional";

//   Storeの定義
const useTasksStore = createWithEqualityFn((set, get) => ({
    tasks : [],
    setTasks: (newtasks) => {set({ tasks: newtasks })},
    addNewTask: (newTask) => {set({ tasks: [...get().tasks, newTask]})},
  }));
  
  export default useTasksStore;