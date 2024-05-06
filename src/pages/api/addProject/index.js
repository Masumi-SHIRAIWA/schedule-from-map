import prisma from "@/util/prisma";

export default async function handler(req, res){
    const {projectName, icon, deadline} = req.body;
    console.log(" req.body in AddProject api: ",  req.body);

    const parseDate = new Date(deadline);

    const result = await prisma.project.create({
        data: {
            name: projectName,
            ownerId: 1,
            icon: icon,
            // deadline: PrismaClient.DateTime.fromDate(parseDate)
            deadline:  parseDate.toISOString()
        },
    })
    res.json(result);
  }