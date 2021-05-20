const {Router, json} = require('express');
const verify = require('../jwt/verifytoken')
const router = new Router();

router.get('/post', verify, (req, res) =>{
    res.json({posts: {title: 'Привет'}});
})

module.exports = router;