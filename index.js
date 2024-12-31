const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json()); // Add this line to parse JSON bodies

const uri = `mongodb+srv://new-users:YxKAFcmFHitG3izs@cluster0.ee44r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const dataCollection = client.db('quotaInjury').collection('datas');
    const contactCollection = client.db('quotaInjury').collection('messages');
    
    // GET all users
    app.get("/datas", async (req, res) => {
      const cursor = dataCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // GET single user
    app.get("/datas/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataCollection.findOne(query);
      res.send(result);
    });

    // CREATE new user
    app.post("/datas", async (req, res) => {
      const newUser = req.body;
      const result = await dataCollection.insertOne(newUser);
      // Return the created user with the generated _id
      const createdUser = { ...newUser, _id: result.insertedId };
      res.status(201).send(createdUser);
      console.log('User created successfully', createdUser);

    });

    // UPDATE user
    app.put("/datas/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          medical_history: updatedUser.medical_history,
          injury_date: updatedUser.injury_date,
          age: updatedUser.age,
          gender: updatedUser.gender,
          contact_details: updatedUser.contact_details,
          occupation: updatedUser.occupation,
          blood_group: updatedUser.blood_group,
          current_status: updatedUser.current_status,
          treatment_type: updatedUser.treatment_type,
          fund_amount_bdt: updatedUser.fund_amount_bdt,
          fund_status: updatedUser.fund_status,
          transaction_date: updatedUser.transaction_date,
          receiver_amount_bdt: updatedUser.receiver_amount_bdt,
          transaction_methods: updatedUser.transaction_methods,
          transaction_id: updatedUser.transaction_id,
          required_support: updatedUser.required_support,
          incident_spot: updatedUser.incident_spot,
          img: updatedUser.img,
          validation : updatedUser.validation
        }
      };
      const result = await dataCollection.updateOne(filter, updateDoc);
      if (result.matchedCount === 0) {
        res.status(404).send({ message: "User not found" });
        return;
      }
      // Return the updated user
      const updated = await dataCollection.findOne(filter);
      res.send(updated);
    });

    // DELETE user
    app.delete("/datas/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataCollection.deleteOne(query);
      if (result.deletedCount === 0) {
        res.status(404).send({ message: "User not found" });
        return;
      }
      res.send({ message: "User deleted successfully" });
    });


    // API to handle form submission
    app.post("/contact", async (req, res) => {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).send({ error: "All fields are required." });
      }

      const newMessage = { name, email, message, date: new Date() };

      try {
        const result = await contactCollection.insertOne(newMessage);
        res.status(201).send({ success: true, message: "Message sent successfully!", result });
      } catch (error) {
        console.error("Error inserting message:", error);
        res.status(500).send({ error: "Failed to send the message." });
      }
    });

    // API to fetch all messages (optional, for admin panel)
    app.get("/contact/messages", async (req, res) => {
      try {
        const messages = await contactCollection.find().toArray();
        res.status(200).send(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).send({ error: "Failed to fetch messages." });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});