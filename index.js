const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// probeshn
// 8zucyPgAfo6DbPoA


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://probeshn:8zucyPgAfo6DbPoA@cluster0.6kl1jhy.mongodb.net/?retryWrites=true&w=majority";

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
    // Send a ping to confirm a successful connection
    const database = client.db("brandDB").collection("brands");


    app.get("/",(req,res)=>{
        res.send("Hi Home page")
    })

    app.get("/products", async (req,res)=>{
        const cursor = database.find();
        const products = await cursor.toArray();
        res.send(products)
    })

    app.post("/products", async (req,res)=>{
      const product = req.body;
      console.log(product)
      const result = await database.insertOne(product)
      res.send(result)
    })



    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen((port),()=>{
    console.log(`project er runing on port ${port}`)
})