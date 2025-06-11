const userController = require('../controllers/userController');

const router = require('express').Router();

router.post('/register',userController.register)
router.post('/refresh_token',userController.refreshToken)

module.exports = router

