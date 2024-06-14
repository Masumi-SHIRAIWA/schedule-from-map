import prisma from "@/util/prisma";

export default async function handler(req, res){
    if(req.method == 'POST') {
      const taskList = req.body.tasks;
      console.log(" req.body in updateTask api: ",  taskList);

      try {
        const updateTask = taskList.filter(task => task.type == "UPDATE");
        for (const task of updateTask) {
          const parseDate = new Date(task.deadline);
          await prisma.task.update({
            where: {id: task.id},
            data: {
              name: task.name,
              done: task.done,
              deadline: parseDate.toISOString(),
              projectId: task.projectId,
              x: task.x,
              y: task.y,
              nodeId: task.nodeId,
              rootNode: task.rootNode,
              parentId: task.parentId
            }
          });
        }

        const newTask = taskList.filter(task => task.type == "NEW");
        for (const task of newTask) {
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
              parentId: task.parentId
            }
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