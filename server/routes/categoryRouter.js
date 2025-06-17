const categoryCtrl = require('../controllers/categoryCtrl');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

const router = require('express').Router();

router.get("/category", categoryCtrl.getCategories);
router.post("/category", auth, authAdmin, categoryCtrl.createCategory);


module.exports = router;