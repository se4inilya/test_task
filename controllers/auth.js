const Users = require('../models/users');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Op = Sequelize.Op;

const SECRET_KEY = "secretkey23456";

module.exports = {
    async login(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        let user;
        try{
            user = await Users.findOne({
                where: {
                    email: email
                }
            });
        }
        catch(e){
            res.status(400).send(e); 
        }
        
        if (!user) return res.status(404).send('User not found!');
        const result = bcrypt.compareSync(password, user.password_hash);
        if (!result) return res.status(401).send('Password not valid!');
        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, {
            expiresIn: expiresIn
        });
        res.status(200).send({ "user": user, "access_token": accessToken, "expires_in": expiresIn });
    }
}