const controllers = require('../controllers/categoryControllers')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const express = require('express')
const router = express.Router()

router.get('/get-categories', jwtMiddleware, controllers.getCategory)
router.put('/update/:id',jwtMiddleware,controllers.updateCategory)
router.post('/create', jwtMiddleware, controllers.createCategory)
router.delete('/delete/:id', jwtMiddleware, controllers.deleteCategory)


module.exports = router