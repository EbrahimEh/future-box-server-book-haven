const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

// BookHaven
// fxqvmfm1J7HWs7pU
const uri = "mongodb+srv://BookHaven:fxqvmfm1J7HWs7pU@cluster0bookhaven.hdkwdsj.mongodb.net/?appName=Cluster0BookHaven";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('Smart Server is running')
})

async function run() {
    try {
        await client.connect();

        //
        const db = client.db('bookHaven');
        const bookCollection = db.collection('books')

        app.get('/books', async(req, res)=>{
            const cursor = bookCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/books/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            result = await bookCollection.findOne(query)
            res.send(result)
        })

        app.post('/books', async(req, res)=>{
            const newBook = req.body;
            const result = await bookCollection.insertOne(newBook)
            res.send(result)
        })

        app.patch('/books/:id', async(req, res)=>{
            const id = req.params.id;
            const updatedBook = req.body;
            const query = {_id: new ObjectId(id)}
            const update = {
                $set: {
                    name: updatedBook.name,
                    price: updatedBook.price
                }
            }
            const result = await bookCollection.updateOne(query, update)
            res.send(result)
        })

        app.delete('/books/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await bookCollection.deleteOne(query)
            res.send(result)
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {

    }
}
run().catch(console.dir)


app.listen(port, () => {
    console.log(`Successfully Connect To Port on ${port}`)
})