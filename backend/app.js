const express = require("express")
const mongoose = require("mongoose")
const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user')
const path = require('path')
const helmet = require("helmet")
const dotenv = require("dotenv")


dotenv.config()

mongoose.connect(`mongodb+srv://${process.env.LOGIN}:${process.env.PASSWORD}@cluster0.axkt8t4.mongodb.net/?retryWrites=true&w=majority`,{
  useNewUrlParser: true,
  useUnifiedTopology: true 
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

// Automatically adds or removes HTTP headers to comply with web security standards
app.use( helmet({ crossOriginResourcePolicy: false} ))

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/auth', userRoutes)
app.use('/api/sauces', saucesRoutes)

module.exports = app
