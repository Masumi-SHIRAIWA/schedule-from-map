import prisma from "@/util/prisma";

export default async function handler(req, res){
  /*
    req.body : [
      updateMessage: "doneUpdate" OR "", ??
      id: ,
      done: ,
      
    ]
   */
    if(req.method == 'POST') {
      const projectId = req.body.id;

      try {
          // const parseDate = new Date(task.deadline);
          await prisma.project.update({
            where: {id: projectId},
            data: {
              done: req.body.done,
            }
          });
        
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