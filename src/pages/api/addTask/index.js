import prisma from "@/util/prisma";

export default async function handler(req, res){
    const {taskName, x, y, parentId, deadline, projectId} = req.body;
    console.log(" req.body in AddTask api: ",  req.body);

    const parseDate = new Date(deadline);

    const result = await prisma.task.create({
        data: {
            name: taskName,
            projectId: projectId,
            deadline:  parseDate.toISOString(),
            x: x,
            y: y,
            parentId: parentId,
        },
    })
    res.json(result);
  }