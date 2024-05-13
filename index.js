const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// 
// 
//middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3wo76be.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const foodCollection = client.db('Restaurant').collection('foodItems');
        const personalCollection = client.db('Restaurant').collection('personalPurchase');
        const userCollection = client.db('Restaurant').collection('user');


        app.get('/foods', async (req, res) => {

            const query = { quantity: { $gt: 0 } };


            const options = {
                // Sort returned documents in ascending order by title (A->Z)
                sort: { quantity: -1 },

            };
            const cursor = foodCollection.find(query, options);
            const result = await cursor.toArray();
            res.send(result);

        })

        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query);
            res.send(result);
        })


        // --------------------------------------------------------
        // personal purchase collection api

        app.get('/purchase', async (req, res) => {
            const cursor = personalCollection.find();

            const result = await cursor.toArray();

            res.send(result);

        })

        app.post('/purchase', async (req, res) => {
            const p = req.body;
            console.log(p);
            const result = await personalCollection.insertOne(p);
            res.send(result);
        })


        // -----------------------------------------------------------


        // userCollection

        app.get('/user', async (req, res) => {
            const cursor = userCollection.find();

            const result = await cursor.toArray();

            res.send(result);

        })

        app.post('/user', async (req, res) => {
            const p = req.body;
            console.log(p);
            const result = await userCollection.insertOne(p);
            res.send(result);
        })
        // end user collection api
        //   -------------------------------





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {

    res.send('assignment 11 server is running');
})

app.listen(port, (req, res) => {
    console.log(`assignment-11 server is running on ${port} `);
})
