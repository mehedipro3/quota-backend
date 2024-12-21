const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000 ;


// middleware 

app.use(cors());
app.use(express());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ee44r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const dataCollection = client.db('quotaInjury').collection('datas');
    // const usersCollection = client.db('quotaInjury').collection('users');

    app.get("/datas",async(req,res)=>{
      const cursor = dataCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/datas/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await dataCollection.findOne(query);
      res.send(result);
    })


    // to get a newUsers 
    // app.post("/datas",async(req,res)=>{
    //   const newUsers = req.body;
    //   console.log(newUsers);
    //   const result = await dataCollection.insertOne(newUsers);
    //   res.send(result);
    // })

    //          /////// // USERS API // ////////

    // app.get('/users', async (req, res) => {
    //   const cursor = usersCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // })

    // app.patch('/users',async(req,res)=>{
    //   const email = req.body.email;
    //   const filter = {email};
    //   const updatedDoc = {
    //     $set :{
    //         lastSignInTime : req.body?.lastSignInTime
    //     }
    //   }
    //   const result = await usersCollection.updateOne(filter,updatedDoc);
    //   res.send(result);
    // })

    // app.post("/users", async (req, res) => {
    //   const newUsers = req.body;
    //   const result = await usersCollection.insertOne(newUsers);
    //   res.send(result);
    // })



    // app.delete("/users/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await usersCollection.deleteOne(query);
    //   res.send(result);
    // })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/",(req,res)=>{
  res.send('Server is running');
});

app.listen(port,()=>{
  console.log(`server is running on port : ${port}`)
})