const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http').Server(app)
app.use(cors());
app.use((req, res, next) => {
 res.header("Access-Control-Allow-Origin", '*')
  next()
})
app.use(require('body-parser').urlencoded({extended: true })) 
app.use('/api', require('./routes'))

app.get('/test', (req, res) => {
  res.send('Working!');
});

http.listen(3030, function () {
  console.log('Server listening on port 3030!')
})
