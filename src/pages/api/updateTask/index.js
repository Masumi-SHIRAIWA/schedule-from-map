import prisma from "@/util/prisma";

export default async function handler(req, res){
    if(req.method == 'POST') {
      const taskList = req.body.tasks;
      console.log(" req.body in updateTask api: ",  taskList);

      try {
        const updateTasks = taskList.filter(task => task.type == "EXISTING");
        for (const task of updateTasks) {
          console.log(task.id)
          // const parseDate = new Date(task.deadline);
          await prisma.task.update({
            where: {id: task.id},
            data: {
              name: task.name,
              done: task.done,
              deadline: task.deadline,
              // deadline: parseDate.toISOString(),
              projectId: task.projectId,
              x: task.x,
              y: task.y,
              nodeId: task.nodeId,
              rootNode: task.rootNode,
              parentNodeId: task.parentNodeId
            }
          });
        }

        const newTasks = taskList.filter(task => task.type == "NEW");
        for (const task of newTasks) {
          const parseDate = new Date(task.deadline);
          await prisma.task.create({
            data: {
              name: task.name,
              done: task.done,
              deadline: parseDate.toISOString(),
              projectId: task.projectId,
              x: task.x,
              y: task.y,
              nodeId: task.nodeId,
              rootNode: task.rootNode,
              parentNodeId: task.parentNodeId
            }
          });
        }

        const delTasks = taskList.filter(task => task.type == "DELETE");
        for (const task of delTasks) {
          await prisma.task.delete({
            where: {id: task.id},
          });
        }
        res.status(200).json({ message: 'Data updated and inserted successfully' });
      } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Error updating and inserting data' });
      }
    } else {
      // METHOD が違う場合
      res.status(405).json({ error: 'Method not allowed' });
    }
  
  }