const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId



// middle ware 
app.use(cors());
app.use(express.json());


//mongo db
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.icikx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db('foodShop');
        const productCollection = database.collection('products');
        const ordersCollection = database.collection('orders');

        app.get('/products', async (req, res) => {
            console.log('hitting database');
            const cursor = await productCollection.find({});
            const result = await cursor.toArray();

            console.log(result);
            res.json(result);
        })
        //get api
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const cursor = await productCollection.findOne(query);
            console.log(cursor);
            res.json(cursor)
        })

        app.post('/order', async (req, res) => {
            const data = req.body;
            console.log('post', data);
            const result = await ordersCollection.insertOne(data);
            res.json(result);
            console.log('result', data);

        })


    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);

//default 
app.get('/', (req, res) => {
    console.log('hi');
    res.send('hot onion server running');

})

//listen
app.listen(port, () => {
    console.log('sever is running at ', port);
})
