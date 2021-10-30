const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

//mongodb
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.jepw0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("database connected");

    const database = client.db("tourde");
    const packageCollection = database.collection("package");
    const bookingCollection = database.collection("booking");
    const reviewCollection = database.collection("review");

    //packageGet
    app.get("/package", async (req, res) => {
      const cursor = packageCollection.find({});
      const package = await cursor.toArray();
      res.send(package);
    });

    //bookingGet
    app.get("/booking", async (req, res) => {
      const cursor = bookingCollection.find({});
      const booking = await cursor.toArray();
      res.send(booking);
    });
    //reviewGet
    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });

    //deleteBooking

    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const booking = await bookingCollection.deleteOne(query);
      res.send(booking);
    });

    //bookingUpdate
    app.put("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const updateBooking = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: "approve",
        },
      };
      const result = await bookingCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //packagePost
    app.post("/createPackage", async (req, res) => {
      const package = req.body;
      const result = await packageCollection.insertOne(package);
      console.log(`Package created with id: ${result.insertedId}`);
      res.json(result);
    });

    //bookingPost

    app.post("/createBooking", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      console.log(`Booking created with id: ${result.insertedId}`);
      res.json(result);
    });

    //reviewPost
    app.post("/createReview", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      console.log(`Booking created with id: ${result.insertedId}`);
      res.json(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log(`Listening port ${port}`);
});
