const Sauce = require('../models/Sauce')
const fs = require('fs')
const sauce = require('../models/Sauce')

// The user can create a sauce.
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id
  delete sauceObject._userId
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    likes: 0,
    dislikes: 0,
    usersDisliked: [],
    usersLiked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  console.log(sauce)
  sauce.save()
    .then(() => { res.status(201).json({ message: 'Sauce enregistré !' }) })
    .catch((error) => { res.status(400).json({ error }) })
}

// The user can display a sauce.
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => { res.status(200).json(sauce) })
    .catch((error) => { res.status(404).json({ error: error }) })
}

// The user can modify a sauce he has created.
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }
  delete sauceObject._userId
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) { res.status(401).json({ message: 'Not authorized' }) }
      else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => { res.status(200).json({ message: 'Objet modifié!' }) })
          .catch((error) => { res.status(401).json({ error }) })
      }
    })
    .catch((error) => { res.status(400).json({ error }) })
}

// The user can delete a sauce he has created.
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' })
      } else {
        const filename = sauce.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .catch(error => res.status(401).json({ error }))
        })
      }
    })
    .catch (error => { res.status(500).json({ error }) })
}

// View get all sauces.
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => { res.status(200).json(sauces) })
    .catch((error) => { res.status(400).json({ error: error }) })
}

// User can like and dislike all the sauces.
exports.noticeSauce = (req, res, next) => {
  const like = req.body.like
  const userId = req.body.userId
  const sauceId = req.params.id
  console.log(sauceId)
  // User like a sauce.
  if (like === 1) {
    Sauce.updateOne(
      { _id: sauceId },
      { $inc: { likes: like }, $push: { usersLiked: userId } }
    )
    .then((sauce) => res.status(200).json({ message: "Sauce aimée !" }))
    .catch((error) => res.status(500).json({ error }))
  }
  // User changes his mind and doesn't like a sauce.
  else {
    Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      if (sauce.usersLiked.includes(userId)) {
        Sauce.updateOne(
          { _id: sauceId },
          { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
        )
        .then((sauce) => { res.status(200).json({ message: "Sauce plus aimée !" }) })
        .catch((error) => { res.status(500).json({ error }) })
      }
    })
    .catch((error) => { res.status(401).json({ error }) })
  }
  
  // User dislike a sauce.
  if (like === -1) {
    Sauce.updateOne(
      {_id: sauceId},
      { $inc: { dislikes: -1 * like }, $push: { usersDisliked: userId } }
    )
    .then((sauce) => { res.status(200).json({ message: "Sauce pas aimée !" }) })
    .catch((error) => { res.status(500).json({ error }) })
  }
  
  // User changes his mind and doesn't dislike a sauce.
  else {
    Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      if (sauce.usersDisliked.includes(userId)) {
        Sauce.updateOne(
          { _id: sauceId },
          { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
        )
        .then((sauce) => { res.status(200).json({ message: "Sauce plus pas aimée !" }) })
        .catch((error) => { res.status(500).json({ error }) })
      }
    })
    .catch((error) => { res.status(401).json({ error }) })
  }
}



