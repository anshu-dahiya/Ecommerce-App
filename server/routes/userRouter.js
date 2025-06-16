const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = require('express').Router();

router.post('/register',userController.register)
router.post('/refresh_token',userController.refreshToken)
router.post('/login',userController.login)
router.get('/logout',userController.logout)
router.get('/info',auth, userController.getUser)

module.exports = router

