const express = require("express");
const app = express();
const cors = require("cors");
const {MongoClient} = require("mongodb");
const URL = "mongodb+srv://shashi:shashi123@cluster0.oxxv5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const DB = "surveyproject";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const port = 8000;

app.use(cors())

app.use(express.json())

//Register data posting to database

app.post("/register",async function(req,res){
    try{
        let connection = await MongoClient.connect(URL);
        let db = connection.db(DB);

        let uniqueEmail  = await db.collection("users").findOne({email:req.body.email});
        if(uniqueEmail){
            res.json({
                message:"email is already in exist"
            })
            
        }else{
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.password,salt)
            // securing the password by encrypting
            req.body.password = hash;

            let users = await db.collection("users").insertOne(req.body);
           await connection.close();
            res.json({
                message:"User is Registered"
            })
        }

    }catch(error){
        console.log(error);
    }

})

//posting the login details

app.post('/login',async function(req,res){
    try{
        let connection = await MongoClient.connect(URL);
        let db = connection.db(DB);

        let user = await db.collection("users").findOne({email:req.body.email})
        
        if(user){
            let isPassword = await bcrypt.compare(req.body.password, user.password);
            if(isPassword){
                let token = jwt.sign({_id:user._id},"asdfghjklzxcvbnm")
                res.json({
                    message:"allow",
                    token,
                    id:user._id
                })
            }else{
                res.json({
                    message:"email or password is incorrect"
                })
            }
        }else{
            res.json({
                message:"email or password is incorrect"
            })
        }
            }catch(error){
                console.log(error)
            }
})

app.get("/users/:id",async function(req,res){
    try{
let connection = await MongoClient.connect(URL);
let db = connection.db(DB);
let users = await db.collection("users").findOne({_id:MongoClient.ObjectId(req.params.id)})
res.json(users)
await connection.close();
    }catch(error){
        console.log(error)
    }
})

app.get("/user/:id",async function(req,res){
    try{
let connection = await MongoClient.connect(URL);
let db = connection.db(DB);
let user = await db.collection("users").findOne({email: req.params.id})
res.json(user)
await connection.close();
    }catch(error){
        console.log(error)
    }
})

app.post("/survey",async function(req,res){
    try{
let connection = await MongoClient.connect(URL);
let db = connection.db(DB);
await db.collection("survey").insertOne(req.body);
await connection.close();
res.json({
    message:"survey entereed"
})
    }
    catch(error){
console.log(error)
    }
})

app.get("/survey/:id",async function(req,res){
    try{
let connection = await MongoClient.connect(URL);
let db = connection.db(DB);
let user = await db.collection("survey").find({email: req.params.id}).toArray();
res.json(user)
console.log(res);
await connection.close();
    }catch(error){
        console.log(error)
    }
})
app.get("/survey",async function(req,res){
    try{
let connection = await MongoClient.connect(URL);
let db = connection.db(DB);
let jobs = await db.collection("survey").find().toArray();
res.json(jobs)
await connection.close();
    }catch(error){
        console.log(error)
    }
})

app.get('/',(req,res)=>res.status(200).send("this is Urantask"));
app.listen(port,()=>console.log(`listening on the port ${port}`))