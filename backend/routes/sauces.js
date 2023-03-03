const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const saucesCtrl = require('../controllers/sauces')
const multer = require('../middleware/multer-config')

router.get("/", auth, saucesCtrl.getAllSauces)
router.post("/", auth, multer, saucesCtrl.createSauce)
router.get("/:id", auth, saucesCtrl.getOneSauce)
router.put("/:id", auth, multer, saucesCtrl.modifySauce)
router.delete("/:id", auth, saucesCtrl.deleteSauce)
router.post("/:id/like", auth, saucesCtrl.noticeSauce)

module.exports = router