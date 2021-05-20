require('dotenv').config()
const User = require('../models/user');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../controller/validation')

class UserController{
    async register(req, res){
        /*
        Проверка на правильность ввода [Валидация]
        */
        const {error} = registerValidation(req.body);
        if( error) return res.status(400).send(error.details[0].message);
        
        /*
        Проверка на повторение эмейл адресса [Валидация]
        */
        const emailExist = await User.findOne({email: req.body.email});
        if(emailExist) return res.status(400).send('Такой email уже зарегистрирован');
        
        /*
        Шифруем пароль
        */
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        try {
            await user.save();
            res.status(200).json({user: user._id});
        } catch (error) {res.status(400).json(error);}
    }
    async login(req, res){
        /*
        Проверка на правильность ввода [Валидация]
        */
        const {error} = loginValidation(req.body);
        if( error) return res.status(400).send(error.details[0].message);

         /*
        Совпадения емайл адреса в db [DatabaseCheckEmail]
        */
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send('Такой email не существует');

        /*
        Совпадения пароля в db [DatabaseCheckPassword]
        */
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass) return res.status(400).send('Такого пароля не существует');
        
        const token = jwt.sign({_id: user._id}, process.env.TOKEN);
        res.header('auth-token', token).send(token);
        
    }
}

module.exports = new UserController();