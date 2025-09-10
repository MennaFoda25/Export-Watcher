import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import {DB} from './db.js'
import bodyParser  from 'body-parser'
dotenv.config({path:'config.env'})

import ApiError from './utils/apiError.js'
import globalError from './Middlewares/errorMiddleware.js'


const app = express();
app.use(bodyParser.json())

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
    console.log(`mode: ${process.env.NODE_ENV}`)
}


app.all('*sth', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

app.get("/api", (req,res)=>{
    res.set('content-type', 'application/json')
    const sql = 'SELECT * FROM users'
    let data = {users:[]}
    try{
        DB.all(sql, [], (err,rows)=>{
            if(err){
                
                throw err
            }
            rows.forEach(row=>{
                data.users.push({id:row.id, name:row.name})
            })

            let content = JSON.stringify(data)
            res.send(content)
        })

    }catch(err){

        console.log(err.message)
        res.status(467)
        res.send(`{"code":467, "status":"${err.message}"}`)
    }
})

app.post("/api",(req,res)=>{
    console.log(req.body)
    res.set('content-type','application/json')
    const sql = 'INSERT INTO  users(name) VALUES (?)'

    let newId
    try{
        DB.run(sql,[req.body.name, req.body.id], function (err){
            if(err) throw err
            newId = this.lastID
            res.status(201)
            let data= { status:201 , message: 'new user is created'}
            let content = JSON.stringify(data)
            res.send(content)
        })

    }catch(err){
         console.log(err.message)
        res.status(468)
        res.send(`{"code":468, "status":"${err.message}"}`)
    }
})

app.delete("/api",(req,res)=>{
    // console.log(req.body)
     res.set('content-type','application/json')
     const sql = 'DELETE FROM users WHERE id=?'

    // let newId
    try{
        DB.run(sql,[req.query.id], function (err){
            if(err) throw err
            //newId = this.lastID
            if(this.changes ===1){
                  res.status(201)
             res.send(`{ message: 'User of id ${req.query.id} was removed'}`)
            }else {
                res.send({message:"no operation needed"})
            }
        })

    }catch(err){
         console.log(err.message)
        res.status(468)
        res.send(`{"code":468, "status":"${err.message}"}`)
    }
})

// Global error handling middleware for express
app.use(globalError);


const PORT = process.env.PORT || 8000
const server = app.listen(PORT,()=>{
    console.log(`App running running on port ${PORT}`)
})

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});