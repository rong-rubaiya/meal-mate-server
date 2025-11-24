const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port =process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.dqh3ts3.mongodb.net/?appName=Cluster0`;

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

    const db = client.db('MealsMateItem');
    const breakmealColl = db.collection('breakItems');
    const lunchmealColl = db.collection('lunchItems');
    const dinnerhmealColl = db.collection('dinnerItems');



    app.get('/breakmeals', async (req, res) => {
      const result = await breakmealColl.find().toArray();
      res.send(result);
    });


    app.get('/lunchmeals', async (req, res) => {
      const result = await lunchmealColl.find().toArray();
      res.send(result);
    });

    app.get('/dinnermeals', async (req, res) => {
      const result = await dinnerhmealColl.find().toArray();
      res.send(result);
    });
    
    await client.connect();
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// SR0eT45CB9dCuXgZ

// mealsMateUser