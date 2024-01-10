const express = require('express')
const cors = require('cors');
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017'; // MongoDB 连接 URL
const app = express()
app.use(cors({ credentials: true, origin: true }))
const port = 8080
const client = new MongoClient(url)
async function add(name, shape) {
    try {
        await client.connect(url)
        const myDB = client.db("myDB");
        const myColl = myDB.collection("pizzaMenu");
        const doc = { name: name, shape: shape };
        const result = await myColl.insertOne(doc);
        console.log(
            `A document was inserted with the _id: ${result.insertedId}`,
        );
    } finally {
        await client.close()
    }
}

async function list() {
    try {
        await client.connect(url)
        const myDB = client.db("myDB");
        const myColl = myDB.collection("pizzaMenu");
        const result = await myColl.find({}).toArray();
        return result
    }finally{
        await client.close()
    }
}

app.post('/add', (req, res) => {
    console.log(req.query)
    const { name, shape } = req.query;
    add(name, shape).catch(console.dir)
    res.send(JSON.stringify({
        status: 0,
        message: '添加成功',
        data: req.query
    }))
})

app.get('/list', (req, res) => {
    list().catch(console.dir).then((r)=>{
        let arr=[]
        r.map(item=>{
            arr.push({
                name: item.name,
                shape: item.shape
            })
        })
        res.send(JSON.stringify({
            status: 0,
            data: arr
        }))
    })
    
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})