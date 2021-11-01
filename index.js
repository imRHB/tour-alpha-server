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

        // Database for Tour Alpha
        const database = client.db('tour-alpha');

        // All collection
        const packageCollection = database.collection('packages');
        const teamCollection = database.collection('team');
        const diskPackCollection = database.collection('discount-package');
        const bookedPackCollection = database.collection('booked-packages');

        // GET API : Packages
        app.get('/packages', async (req, res) => {
            const packages = await packageCollection.find({}).toArray();
            res.send(packages);
        });

        // GET API : Booked Packages
        app.get('/booked-packages', async (req, res) => {
            const bookedPackages = await bookedPackCollection.find({}).toArray();
            res.send(bookedPackages);
        });

        // GET API : Discount Package
        app.get('/discount-package', async (req, res) => {
            const diskPack = await diskPackCollection.find({}).toArray();
            res.send(diskPack);
        });

        // GET API : Team and Guide
        app.get('/team', async (req, res) => {
            const team = await teamCollection.find({}).toArray();
            res.send(team);
        });

        // POST API : Add New Package
        app.post('/add-package', async (req, res) => {
            const newPackage = req.body;
            packageCollection.insertOne(newPackage)
                .then(result => {
                    res.send(result.insertedId);
                });
        });

        // POST API : Booked Packages
        app.post('/booked-packages', async (req, res) => {
            const bookedPackage = req.body;
            bookedPackCollection.insertOne(bookedPackage)
                .then(result => {
                    console.log('Package booked with ID', result);
                    res.send(result);
                })
        });

        // GET API : Single Package
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await packageCollection.findOne(query);
            res.send(result)
        });

        // GET API : Discount Package
        app.get('/discount-package/:packgId', async (req, res) => {
            const packgId = req.params.packgId;
            const query = { _id: ObjectId(packgId) };
            const result = await diskPackCollection.findOne(query);
            res.send(result);
        });

        // DELETE API : Single Tour Package
        app.delete('/packages/:packgId', async (req, res) => {
            const packgId = req.params.packgId;
            const query = { _id: ObjectId(packgId) };
            const result = await packageCollection.deleteOne(query);
            res.json(result);
        });

        // DELETE API : Booking Package
        app.delete('/booked-packages/:packgId', async (req, res) => {
            const packgId = req.params.packgId;
            const query = { _id: packgId };
            const result = await bookedPackCollection.deleteOne(query);
            res.json(result);
            console.log(result);
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
    console.log('Tour Alpha server is running at port', port);
});