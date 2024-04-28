const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const port = process.env.PORT || 3000;

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.user_db}:${process.env.secret_key}@cluster0.2evw8as.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const touristSpotCollection = client
      .db("tourist_spot_db")
      .collection("tourist_spot");

    // create tourist spot and send to the db
    app.post("/landmarks", async (req, res) => {
      const newLandmarks = req.body;
      console.log(newLandmarks);
      const result = await touristSpotCollection.insertOne(newLandmarks);
      res.send(result);
    });
    // read the data from the server
    app.get("/landmarks", async (req, res) => {
      const cursor = await touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/landmarks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    });

    // read data
    app.get("/lists", async (req, res) => {
      const cursor = await touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/lists/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    });

    // delete user spots
    app.delete("/lists/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.deleteOne(query);
      res.send(result);
    });

    // update value
    app.put("/update/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const options = { upsert: true };
      const data = {
        $set: {
          imageURL: req.body.imageURL,
          spot_name: req.body.spot_name,
          location: req.body.location,
          average_cost: req.body.average_cost,
          travel_time: req.body.travel_time,
          visitor_per_year: req.body.visitor_per_year,
          seasonality: req.body.seasonality,
          country_name: req.body.country_name,
          email: req.body.email,
          user: req.body.user,
          description: req.body.description,
        },
      };
      const result = await touristSpotCollection.updateOne(
        query,
        data,
        options
      );
      console.log(result);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`Adventure Axis is running on the server`);
});

app.listen(port, () => {
  console.log(`Adventure Axis is running on ${port}`);
});
