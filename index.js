const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app =express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ebhzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        //console.log('connected')
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');
        //GET API
        app.get('/services', async(req,res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //GET SINGLE SERVICE ID

        app.get('/services/:id', async(req,res)=>{
            const id = req.params.id;
            console.log('hitting the post',id);
            const query = {_id:ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })

        //POST API
        app.post('/services', async(req,res)=>{
           

            const service = req.body;
            // console.log('hot post',service)
            const result = await servicesCollection.insertOne(service);
            // console.log(result);
            res.json(result)
        });

        //DELETE API
        app.delete('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('running genius server')
})

app.listen(port, () =>{
    console.log('running genius server o  port', port)
})
// myDBUser2 
// unWWZIp0AMdadma3