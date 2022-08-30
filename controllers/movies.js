const Movies = require('../models/movies');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {

    create(req, res) {
        console.log(req.body);
        return Movies
            .create({
                title: req.body.title,
                year: req.body.year,
                format: req.body.format,
                actors: req.body.actors.toString(),
            })
            .then(movie => { res.status(201).send(movie) })
            .catch(error => {
                res.status(400).send(error);
            })
    },
    async getAll(req, res) {
        const limit = req.query.limit ? parseInt(req.query.limit) : 20;
        const offset = req.query.offset ? parseInt(req.query.offset) * limit : 0;
        let movies;
        if (req.query.search) {
            try {
                movies = await Movies.findAll({
                    where: {
                        [Op.or] : [
                        {title:
                        {
                            [Op.like]: `%${req.query.search}%`
                        },},
                        {actors: 
                        {
                            [Op.like]: `%${req.query.search}%`
                        }}]
                    },
                    order: [
                        [req.query.sort || 'id', req.query.order || 'ASC']
                      ],
                    offset,
                    limit,
                });
                if (movies.length === 0) {
                    Err = "No movies found";
                }
                res.status(200).send(movies);
            }
            catch (error) {
                res.status(400).send(error)
            }
        }
        else if(req.query.title){
            try {
                movies = await Movies.findAll({
                    where: {
                        title:
                        {
                            [Op.like]: `%${req.query.title}%`
                        },
                    },
                    order: [
                        [req.query.sort || 'id', req.query.order || 'ASC']
                      ],
                    offset,
                    limit,
                });
                if (movies.length === 0) {
                    Err = "No movies found";
                }
                res.status(200).send(movies);
            }
            catch (error) {
                res.status(400).send(error)
            }
        }
        else if(req.query.actor){
            try {
                movies = await Movies.findAll({
                    where: {
                        actors: 
                        {
                            [Op.like]: `%${req.query.actor}%`
                        }
                    },
                    order: [
                        [req.query.sort || 'id', req.query.order || 'ASC']
                      ],
                    offset,
                    limit,
                });
                if (movies.length === 0) {
                    Err = "No movies found";
                }
                res.status(200).send(movies);
            }
            catch (error) {
                res.status(400).send(error)
            }
        }
        else {   
            try {
                movies = await Movies
                    .findAndCountAll({
                        order: [
                            [req.query.sort || 'id', req.query.order || 'ASC']
                          ],
                        offset,
                        limit,
                    })


                res.status(200).send(movies);

            }
            catch (error) { res.status(400).send(error) };
        }
    },
    getById(req, res) {
        return Movies
            .findOne({
                where: {
                    id: req.params.id,
                }
            })
            .then(
                movie => {
                    if (!movie)
                        res.status(404).send({message : 'Not Found'});
                    else
                        res.status(200).send(movie);
                }
            )
            .catch(error => { res.status(400).send(error) });
    },
    deleteById(req, res) {
        return Movies
            .findOne({
                where: {
                    id: req.params.id,
                }
            })
            .then(movie => {
                if (!movie) {
                    return res.status(404).send({
                        message: 'Movie Not Found',
                    });
                }
                return movie
                    .destroy()
                    .then(() => {

                        res.status(204).send();
                    })
                    .catch(error => res.status(400).send(error));
            }
            )
            .catch(error => res.status(400).send(error));
    },

    // update

    async updateById(req, res) {
        try {
            let movie = await Movies
                .findOne({
                    where: {
                        id: req.params.id,
                    }
                })
            if (!movie) {
                return res.status(404).send({
                    message: 'Movie Not Found'
                });
            }
            let updated_movie = await movie.update({...req.body, actors: req.body.actors.toString()}, 
                { fields: Object.keys(req.body) });
            return res.status(200).send(updated_movie);
        } catch (error) {
            return res.status(400).send({ message: 'Updating user failed', error: error });
        }
    },

    async import(req, res){
        const keys = Object.keys(req.files);
        if(!keys || !keys.length) res.send(400, "File was not found.");
        const data = Buffer.from(req.files[keys[0]].data);
        let moviesStr = data.toString();
        const moviesArr = moviesStr.split("\n\n");
        const moviesObjList = []; 
        for (const movie of moviesArr) {
            const movieArr = movie.split("\n");
            const title = movieArr[0].slice(7);
            const year = parseInt(movieArr[1].slice(14));
            const format = movieArr[2].slice(8);
            const actors = movieArr[3].slice(7);
            let movieObj;
            try{
                movieObj = await Movies.create({title,year,format,actors})
            }
            catch(error) {
                res.status(400).send(error);
            }
            moviesObjList.push(movieObj.dataValues);
        }
        return res.status(200).send(moviesObjList);
    }
}