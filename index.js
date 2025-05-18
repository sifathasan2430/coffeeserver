import express from 'express'
import {MongoClient, ObjectId, ServerApiVersion} from "mongodb"
import 'dotenv/config'
const app=express()
const port=process.env.PORT || 3000
app.use(express.json())

//coffeehouse
//6Lx4AQKCZM7JIpbJ


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0wvxfgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    await client.connect();

 const myDB=client.db('myDB')
 const myColl=myDB.collection("coffees")
 const userDB=myDB.collection("UserDataBase")
   
    app.post('/api/coffees',async(req,res)=>{
    const  mydoc=req.body

const result=await myColl.insertOne(mydoc)
        console.log('result')
        res.send(result)
    })
     app.get('/api/details/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id:new ObjectId(id)}
      const result=await myColl.findOne(query)
      res.send(result)
     })

    app.get("/api/coffees",async(req,res)=>{
        const cursor=myColl.find()
        const result=await cursor.toArray()
        res.send(result)
    })
    app.put("/api/updatecoffee/:id",async(req,res)=>{
const id=req.params.id
console.log(req.body)


      const filter={_id:new ObjectId(id)}
      const updateDoc={
        $set:req.body }
      
      const result=await myColl.updateOne(filter,updateDoc)
      console.log(result)
      res.send(result)

   } )
    // app.delete(`/api/delete/:id`,async(req,res)=>{
    //     const id=req.params.id
    //       const query={_id: new ObjectId(id)}
    //       const result=await myColl.deleteOne(query)
    //       res.send(result)
    //     console.log('delete successfully')
    // })
    app.delete(`/api/delete/:id`,async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await myColl.deleteOne(query)
      res.send(result)
    })
    app.post("/api/users",async(req,res)=>{
      const usersdata=req.body

      const result=await userDB.insertOne(usersdata)
      res.send(result)
    })
    app.get("/api/profile",async(req,res)=>{
      const cursor= userDB.find()
      const result=await cursor.toArray()
      res.send(result)
    })
    app.delete("/api/profiledelete/:id",async(req,res)=>{
      console.log('server is hiting')
       const id=req.params.id
      console.log(id)
       const query={_id: new ObjectId(id)}
       const result=await userDB.deleteOne(query)
       res.send(result)
    })
    app.patch("/api/user",async(req,res)=>{
      const {email,lastSignInTime}=req.body
      const filter={email:email}
      const updateDoc={
        $set:{
          lastSignInTime:lastSignInTime,
        }
      }
      const result=await userDB.updateOne(filter,updateDoc)
      res.send(result)
    })
  
    await client.db("admin").command({ ping: 1 });
    console.log(process.env.DB_USER)
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
   
  }
}
run().catch(console.dir);
app.listen(port,()=>{
    console.log(`server is listing on ${port}`)
})