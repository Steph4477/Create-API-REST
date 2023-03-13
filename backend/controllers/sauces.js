const Sauce = require('../models/Sauce')
const fs = require('fs')

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
  .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
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

  // find the existing sauce and retrieve the image filename
  Sauce.findOne({ _id: req.params.id })
  .then((sauce) => {
    if (sauce.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Unauthorized request' })
    } else {  
      // update the sauce with the new data
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => {
        let oldImageUrl = sauce.imageUrl          
        // if a new image was uploaded, delete the old one
        if (req.file && oldImageUrl) {
          let filename = oldImageUrl.split('/images/')[1]
          fs.unlink(`images/${filename}`, () => {})
        }
        res.status(200).json({ message: 'Sauce modifiée !' })  
      })  
      .catch((error) => { res.status(500).json({ error: "Erreur de modification !" }) })
    }
  })
  .catch((error) => { res.status(500).json({ error: "Impossible de trouver la sauce pour la modifier !" }) })
}

// The user can delete a sauce he has created.
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: 'unauthorized request' })
      } else {
        const filename = sauce.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
          .then(() => { res.status(200).json({ message: "Sauce supprimée !" }) })
          .catch(error => res.status(401).json({ error }))
        })
      }
    })
  .catch (error => { res.status(500).json({ error }) })
}

// The user can view get all sauces.
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauces) => { res.status(200).json(sauces)})
  .catch((error) => { res.status(400).json({ error: error }) })
}
 
// The user can like and dislike a sauce.
exports.noticeSauce = (req, res) => {
  const like = req.body.like
  const userId = req.body.userId
  const sauceId = req.params.id
  
  // Check if like value is valid.
  if (![1, 0, -1].includes(like)) {
    return res.status(400).json({ error: "La valeur de like doit être égale à 1, 0 ou -1" })
  }

  Sauce.findOne({ _id: sauceId })
  .then((sauce) => {
    
    // The user like a sauce.
    if (like === 1) {
      // Check if the user has already liked the Sauce.
      if (sauce.usersLiked.includes(userId)) {
        return res.status(400).json({ error: "Vous avez déjà aimé cette sauce !" })
      }

      // Check if the user has ever hated the sauce before.
      if (sauce.usersDisliked.includes(userId)) {
        sauce.dislikes--
        sauce.usersDisliked.pull(userId)
      }

      // Add the like and push the user ID in the table of users who liked the sauce.
      sauce.likes++
      sauce.usersLiked.push(userId)
      sauce.save()
      return res.status(200).json({ message: "Vous aimez cette sauce !" })
    }

    // The user not likes or dislikes a sauce.
    if (like === 0) {
      // Check if the user liked the sauce before.
      if (sauce.usersLiked.includes(userId)) {
        sauce.likes--
        sauce.usersLiked.pull(userId)
        sauce.save()
        return res.status(200).json({ message: "Vous n'aimez plus cette sauce !" })
      }

      // Check if the user hated the sauce before.
      if (sauce.usersDisliked.includes(userId)) {
        sauce.dislikes--
        sauce.usersDisliked.pull(userId)
        sauce.save()
        return res.status(200).json({ message: "Vous ne détestez plus cette sauce !" })
      }
    }

    // the user dislike a sauce.
    if (like === -1) {
      // Check if the user has ever dislike the Sauce.
      if (sauce.usersDisliked.includes(userId)) {
        return res.status(400).json({ error: "Vous avez déjà pas aimé cette sauce !" })
      }

      // Check if the user liked the sauce before.
      if (sauce.usersLiked.includes(userId)) {
        sauce.likes--
        sauce.usersLiked.pull(userId)
      }

      // Add the dislike and push the user's ID to the table of users who disliked the sauce.
      sauce.dislikes++
      sauce.usersDisliked.push(userId)
      sauce.save()
      return res.status(200).json({ message: "Vous n'aimez pas cette sauce !" })
    }

    // Save the sauce changes.
    sauce.save()
    .then(() => res.status(200).json({ message: "Votre avis sur la sauce à bien été sauvegarder !" }))
    .catch((error) => res.status(500).json({ error }))
  })
  .catch(() => res.status(500).json({ error : "une erreur c'est produite" }))
}


