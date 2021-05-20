const {Router, json} = require('express');
const router = new Router();
const UserController = require('../controller/userController')

router.post('/register', UserController.register);
router.post('/login', UserController.login);


module.exports = router;