const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// probeshn
// 8zucyPgAfo6DbPoA


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    app.get("/products/:id", async (req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const product = await database.findOne(query);
      // const products = await cursor.toArray();
      res.send(product)
  })

  app.get("/product/:brand", async (req,res)=>{
    const brand = req.params.brand;
    const searchBrand = {brandName: brand}
    const result = database.find(searchBrand)
    res.send(result)
    
  })

    app.post("/products", async (req,res)=>{
      const product = req.body;
      console.log(product)
      const result = await database.insertOne(product)
      res.send(result)
    })

    app.put("/products/:id",async (req,res)=>{
      const id = req.params.id;
      const product = req.body;
      // console.log(id,product)
      const filter = {_id: new ObjectId(id)}
      const options = {upsert:true}
      const updateProducts = {
        $set:{
          productName: product.productName,
          description: product.description,
          productImg: product.productImg,
          price: product.price,
          brandName: product.brandName,
          rating: product.rating,
          category: product.category
        }
      }
      const result = await database.updateOne(filter,updateProducts,options)
      res.send(result)
    })

    // delete
    app.delete("/products/:id",async (req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await database.deleteOne(query)
      res.send(result)
    })


    // for cart
    const cartDB = client.db("brandDB").collection("carts");

    app.get("/cart", async(req,res)=>{
      const cursor = cartDB.find()
      const result =await cursor.toArray();
      res.send(result)
    })

    app.post("/cart",async(req,res)=>{
      const cart = req.body;
      const result = await cartDB.insertOne(cart)
      // console.log(cart)
      res.send(result)
    })

     // delete
    app.delete("/cart/:productId",async (req,res)=>{
      const id = req.params.productId;
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const result = await cartDB.deleteOne(query)
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