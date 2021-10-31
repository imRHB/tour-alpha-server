const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.whfic.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db('tour-alpha');

        const serviceCollection = database.collection('services');
        const packageCollection = database.collection('packages');
        const teamCollection = database.collection('team');
        const diskPackCollection = database.collection('discount-package');
        const bookedCollection = database.collection('booked-packages');

        // GET Services API
        app.get('/services', async (req, res) => {
            const services = await serviceCollection.find({}).toArray();
            res.send(services);
        });

        // GET Packages API
        app.get('/packages', async (req, res) => {
            const packages = await packageCollection.find({}).toArray();
            res.send(packages);
        });

        // GET Team API
        app.get('/team', async (req, res) => {
            const team = await teamCollection.find({}).toArray();
            res.send(team);
        });

        // GET Discount Offer Item API
        app.get('/discount-package', async (req, res) => {
            const diskPack = await diskPackCollection.find({}).toArray();
            res.send(diskPack);
        });

        // POST Add Package API
        app.post('/add-package', async (req, res) => {
            const newPackage = req.body;
            packageCollection.insertOne(newPackage)
                .then(result => {
                    res.send(result.insertedId);
                });
        });

        // POST Book Package API
        app.post('/booked-package', async (req, res) => {
            const bookedPackage = req.body;
            bookedCollection.insertOne(bookedPackage)
                .then(result => {
                    res.send(result.insertedId);
                });
        });

        // GET Single Package API
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await packageCollection.findOne(query);
            res.send(result)
        });

        // GET Discount Package API
        app.get('/discount-package/:packgId', async (req, res) => {
            const packgId = req.params.packgId;
            const query = { _id: ObjectId(packgId) };
            const result = await diskPackCollection.findOne(query);
            res.send(result);
        });

        // DELETE Single Package API
        app.delete('/packages/:packgId', async (req, res) => {
            const packgId = req.params.packgId;
            const query = { _id: ObjectId(packgId) };
            const result = await packageCollection.deleteOne(query);
            res.json(result);
            console.log('Package deleted, ID', result);;
        });

    }

    finally {
        // client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tour Alpha Server is running.');
});

app.listen(port, (req, res) => {
    console.log('Tour Alpha server is running at port',);
});