const express = require('express');
const cors =require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port =process.env.PORT||5000;
require('dotenv').config()

// middlewire 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.umu1r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const productCollection =client.db('emaJohn').collection('product');

        app.get('/product',async(req,res)=>{
          console.log('query',req.query);
          const page =parseInt(req.query.page);
          const size=parseInt(req.query.size);
            const query ={};
            const cursor =productCollection.find(query);
            let products;
            if(page|| size){
              // 0-->skip: 0 get:0-10
              // 1-->skip: 1 get:11-20
              // 2-->skip: 3 get:21-30
              products = await cursor.skip(page*size).limit(size).toArray();

            }
            else{
              products = await cursor.toArray();

            }

            res.send(products);
        })
        app.get('/productCount', async(req,res)=>{
            // const query ={};
            // const cursor =productCollection.find(query);
            const count =await productCollection.estimatedDocumentCount();
            // res.json(count);
            res.send({count});
            // ekahne object dici karon nahoy string hisebe jabe na 

        })
        //use post to get products by ids 
        app.post('/productByKeys',async(req,res)=>{
          const keys =req.body;
          const ids =keys.map(id=>ObjectId(id))
          const query ={_id:{$in: ids}}
          const cursor =productCollection.find(query);
          const products=await cursor.toArray();
          console.log(keys);
          res.send(products);
        })
    }
    finally{

    }

}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('John is running  and waiting for ema!')
})

app.listen(port, () => {
  console.log('john is runnig on pot ',port);
})