const app  = require('./app')
const dotenv = require('dotenv')
const connectTODb = require('./config/db')

dotenv.config({path:'back-end/config/config.env'});

process.on('uncaughtException',(err)=>{

    console.log(`error : ${err.message}`);
    console.log('shutting down the server due to uncaughtException');

    process.exit(1);
    

})

connectTODb();


const server = app.listen(process.env.PORT,()=>{
    console.log(`server started listening on http://localhost:${process.env.PORT}`);
})

process.on("unhandledRejection", (err)=>{
    console.log(`error : ${err.message}`);
    console.log('shutting down the server due to unhandled promise rejection');

    server.close(()=>{
        process.exit(1);
    })
})