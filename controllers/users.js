const Users = require('../models/users');
const Bots = require('../models').bots;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    async create(req, res) {
        try {
            let user = await Users.create({
                name: req.body.name,
                password_hash: req.body.password,
                email: req.body.email,
            })

            return res.status(201).send(user); // TODO: Change return to res.render

        }
        catch (error) {
            return res.status(400).send(error);
        }
    },
    async getAll(req, res) {
        if (req.query.search) {
            try {
                let users = await Users.findAll({
                    where: {
                        username:
                        {
                            [Op.iLike]: `%${req.query.search}%`
                        }
                    }
                });
                if (users.length === 0) {
                    Err = "No bots found";
                }
                res.status(200).send(users);
            }
            catch (error) {
                res.status(400).send(error)
            }


        }
        else {
            const page = parseInt(req.query.page) || 1;
            const pageSize = 3;
            const offset = page * pageSize - pageSize;
            const limit = pageSize;
            try {
                let users = await Users
                    .findAndCountAll({
                        offset,
                        limit,
                    })


                res.status(200).send(users);

            }
            catch (error) { res.status(400).send(error) };
        }
    },
    async getById(req, res) {
        try {
            let user = await Users.findByPk(req.params.id);
            if (!user)
                res.status(404).send({ message: 'Not Found' });
            else
                res.status(200).send(user);
        }

        catch (error) {
            return res.status(400).send(error);
        }
    },
    async setAdmin(req, res) {
        try {
            let user = await Users
                .findByPk(req.params.userId
                );
            if (!user) {
                return res.status(404).send({
                    message: 'User Not Found'
                });
            }
            await user.update({
                role: 1
            });
            return res.status(200).send();
        } catch (error) {
            return res.status(400).send(error);
        }

    },
    async revokeAdmin(req, res) {
        try {
            let user = await Users
                .findByPk(req.params.userId
                );
            if (!user) {
                return res.status(404).send({
                    message: 'User Not Found'
                });
            }
            await user.update({
                role: 0
            });
            return res.status(200).send();
        } catch (error) {
            return res.status(400).send(error);
        }

    },
    async updateById(req, res) {
        try {
            let user = await Users
                .findByPk(req.params.userId, {
                    include: [{
                        model: Bots,
                        as: 'bots',
                    }]
                });
            if (!user) {
                return res.status(404).send({
                    message: 'User Not Found'
                });
            }
            let updated_user = await user.update(req.body, { fields: Object.keys(req.body) });
            return res.status(200).send(updated_user);
        } catch (error) {
            return res.status(400).send({ message: 'Updating user failed', error: error });
        }
    },
    async deleteById(req, res) {
        try {
            let user = await Users.findByPk(
                req.params.id,

            );
            if (!user) {
                return res.status(404).send({
                    message: 'User Not Found',
                });
            }
            await user.destroy();
            res.status(204).send();


        }
        catch (error) {
            res.status(400).send(error);
        }
    }
}