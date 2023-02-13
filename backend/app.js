const express = require("express")

const app = express ()

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Stephane:CestmonMDP@cluster0.axkt8t4.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.post('/api/stuff', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Objet créé !'
  });
});

app.get('/api/stuff', (req, res, next) => {
    const stuff = [
      {
        _id: 'coucou',
        title: 'Mon premier objet',
        description: 'Les infos de mon premier objet',
        imageUrl: '<image>.jpg',
        price: 2500,
        userId: 'qsomihvqios',
      },
      {
        _id: 'sauce_2',
        title: 'Mon deuxième objet',
        description: 'Les infos de mon deuxième objet',
        imageUrl: '<image>.jpg',
        price: 6500,
        userId: 'qsomihvqios',
      },
    ];
    res.status(200).json(stuff);
  });
module.exports = app
