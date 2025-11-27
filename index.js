const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const myorder=db.collection('order')
    const reviweColl=db.collection('reviwes')

    // reviwes

    app.get('/reviews', async (req, res) => {
      const result = await reviweColl.find().toArray();
      res.send(result);


    });
// sort 
    app.get('/topratings/reviews', async (req, res) => {
  try {
    // Filter reviews with rating between 4.5 and 5
    const result = await reviweColl
      .find({ rating: { $gte: 4.5, $lte: 5 } }) // filter ratings >=4.5 and <=5
      .sort({ rating: -1 }) // sort descending
      .toArray();

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch reviews" });
  }
});



    app.get('/breakmeals', async (req, res) => {
      const result = await breakmealColl.find().toArray();
      res.send(result);
    });

    // single breakfast

    app.get('/breakmeals/:id', async (req, res) => {
      const { id } = req.params;
      const result = await breakmealColl.findOne({ _id: new ObjectId(id) });
      res.send({ success: true, result });
    });

    // sort-break l-h

     app.get('/breakmeals/sort/low-high', async (req, res) => {
      try {
        const result = await breakmealColl
          .find()
          .sort({price: 1 })
          
          .toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });

    // sort break h-l

    app.get('/breakmeals/sort/high-low', async (req, res) => {
      try {
        const result = await breakmealColl
          .find()
          .sort({price: -1 })
          
          .toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });

    // lunch


    app.get('/lunchmeals', async (req, res) => {
      const result = await lunchmealColl.find().toArray();
      res.send(result);
    });
// single lucnch
    app.get('/lunchmeals/:id', async (req, res) => {
      const { id } = req.params;
      const result = await lunchmealColl.findOne({ _id: new ObjectId(id) });
      res.send({ success: true, result });
    });


     // sort-lunch l-h

     app.get('/lunchmeals/sort/low-high', async (req, res) => {
      try {
        const result = await lunchmealColl
          .find()
          .sort({price: 1 })
          
          .toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });

    // sort lunch h-l

    app.get('/lunchmeals/sort/high-low', async (req, res) => {
      try {
        const result = await lunchmealColl
          .find()
          .sort({price: -1 })
          
          .toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });

    

     

    // dinner

    app.get('/dinnermeals', async (req, res) => {
      const result = await dinnerhmealColl.find().toArray();
      res.send(result);
    });


    // single dinner

    app.get('/dinnermeals/:id', async (req, res) => {
      const { id } = req.params;
      const result = await dinnerhmealColl.findOne({ _id: new ObjectId(id) });
      res.send({ success: true, result });
    });

    // sort-dinner l-h

     app.get('/dinnermeals/sort/low-high', async (req, res) => {
      try {
        const result = await dinnerhmealColl
          .find()
          .sort({price: 1 })
          
          .toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });


    // sort dinner h-l

    app.get('/dinnermeals/sort/high-low', async (req, res) => {
      try {
        const result = await dinnerhmealColl
          .find()
          .sort({price: -1 })
          
          .toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });


    // order

    app.post('/orders', async (req, res) => {
  const order = req.body; // mealId, mealName, price, category, userEmail, etc.
  const result = await myorder.insertOne(order);
  res.send({ success: true, message: 'Order placed successfully', orderId: result.insertedId });
});





app.get('/orders', async (req, res) => {
  const email = req.query.email; 
  const orders = await myorder.find({ userEmail: email }).toArray();
  res.send({ success: true, orders });
});

// delete order

app.delete('/orders/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await myorder.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.send({ success: true, message: 'Order deleted successfully' });
    } else {
      res.send({ success: false, message: 'Order not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: 'Failed to delete order' });
  }
});







// PATCH /orders/:id
app.patch('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // { quantity, notes }

    // Validate input (optional)
    if (!updateData.quantity && !updateData.notes) {
      return res.status(400).send({ success: false, message: "Nothing to update" });
    }

    const result = await myorder.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ success: false, message: "Order not found" });
    }

    res.send({ success: true, message: "Order updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Server error" });
  }
});





// GET /top-rated-meals
app.get('/top-rated-meals', async (req, res) => {
  try {
    // Fetch top-rated meals from each collection
    const breakMeals = await breakmealColl.find({ reviews: { $gte: 4.5, $lte: 5 } }).toArray();
    const lunchMeals = await lunchmealColl.find({ reviews: { $gte: 4.5, $lte: 5 } }).toArray();
    const dinnerMeals = await dinnerhmealColl.find({ reviews: { $gte: 4.5, $lte: 5 } }).toArray();

    // Combine all meals and add a category field
    const allTopMeals = [
      ...breakMeals.map(m => ({ ...m, category: 'breakfast' })),
      ...lunchMeals.map(m => ({ ...m, category: 'lunch' })),
      ...dinnerMeals.map(m => ({ ...m, category: 'dinner' }))
    ];

    // Optional: sort by reviews descending
    allTopMeals.sort((a, b) => b.reviews - a.reviews);

    res.send(allTopMeals);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: err.message });
  }
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

