const User = require('../models/auth/User');
const Role = require('../models/auth/Role')
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { secret } = require('../config')
const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"});
}



class authController{
    async register(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) return res.status(400).json({message: "Ошибка при регистрации", errors})
            const {email, username, password} = req.body;
            const candidate = await User.findOne({email});
            if(candidate) return res.status(400).json({message: 'Пользователь уже с таким почтовым адрессом существует.'});
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"});
            const user = new User({email, username, password: hashPassword, roles: [userRole.value]});
            await user.save();
            return res.json({message: "Пользователь успешно был создан"});

        } catch (error) {
            console.log(error);
            res.status(400).json({message: 'Произошла ошибка регистрации'});
        }
    }
    async login(req, res){
        try {
            const {email, password} = req.body;
            const user = await User.findOne({email});
            if(!user) return res.status(400).json({message:`Пользователь с ${email} не найден`});
            const validPassword = bcrypt.compareSync(password, user.password);
            if(!validPassword) return res.status(400).json({message: `Ваш пароль ${password} не верный`});
            const token = generateAccessToken(user._id, user.roles);
            return res.json({message: token});
        } catch (error) {
            console.log(error);
            return res.status(400).json({message: 'Произошла ошибка авторизации'});
        }
    }
    async getUsers(req, res){
        try {
            const users = await User.find();
            return res.json({users});
        } catch (error) {
            return res.status(400).json({message: "Ошибка"})
        }
    }

    async deleteUsers(req, res){
        try {
            const {id} = req.params;
            if(!id) return res.status(400).json({message: "Не указан id"});
            const user = await User.findByIdAndDelete(id);
            return res.status(200).json({message: "Пользователь удалён"});
        } catch (error) {
            return res.status(400).json({message: "Ошибка"});
        }
    }
}
module.exports = new authController();