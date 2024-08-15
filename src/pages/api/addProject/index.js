import prisma from "@/util/prisma";

export default async function handler(req, res){
    const {projectName, icon, colorid, deadline} = req.body;
    console.log(" req.body in AddProject api: ",  req.body);
    console.log("typeof colorid", typeof(colorid))
    const parseDate = new Date(deadline);

    const result = await prisma.project.create({
        data: {
            name: projectName, // string
            // ownerId: 1, // 変更
            owner: {
                connect: { id: 1 },  // 既存のUser IDを使用
            },
            icon: icon, // string
            colorid: colorid, // int
            // deadline: PrismaClient.DateTime.fromDate(parseDate)
            deadline:  parseDate.toISOString()
        },
    })
    res.json(result);
  }