const express = require('express');
const cors =require('cors');
const app = express()
const port =process.env.PORT||5000;

// middlewire 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('John is running  and waiting for ema!')
})

app.listen(port, () => {
  console.log('john is runnig on pot ',port);
})