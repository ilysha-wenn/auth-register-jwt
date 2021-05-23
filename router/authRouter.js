const Router = require('express');
const router = new Router();
const controller = require('../controller/authController');
const {check} = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/registration',[
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 4 и меньше 10').isLength({min:4, max:10}),
    check('email', 'Ваш почтовый адресс должен быть введён корректно').isEmail().notEmpty()
] , controller.register);
router.post('/login', controller.login)
router.get('/users', roleMiddleware(['ADMIN', 'USER']) , controller.getUsers);

module.exports = router;