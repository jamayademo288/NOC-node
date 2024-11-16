import { PrismaClient } from "@prisma/client";
import { envs } from "./config/plugins/envs.plugin";
import { LogModel, MongoDatabase } from "./data/mongo";
import { Server } from "./presentation/server";

(async() => {
    await main();
})()

async function main() {
    
    await MongoDatabase.connect({
        mongoUrl: envs.MONGO_URL,
        dbName: envs.MONGO_DB_NAME
    });

    const prisma = new PrismaClient();
    // const newLog = await prisma.logModel.create({
    //     data: {
    //         message: 'Test message desde prisma',
    //         origin: 'app.ts',
    //         level: 'HIGH'
    //     }
    // });

    // console.log({newLog})

    const logs = await prisma.logModel.findMany({
        where: {
            level: 'MEDIUM',
        }
    });
    //console.log(logs)

    //grabar y crear registros
    // const newLog = await LogModel.create({
    //     message: 'Test message desde mongo',
    //     origin: 'app.ts',
    //     level: 'low',
    //     createdAt: new Date()
    // })

    // await newLog.save();

    // const logs = await LogModel.find();
    
    // console.log(logs)

    //console.log(newLog)

    //Server.start()
}