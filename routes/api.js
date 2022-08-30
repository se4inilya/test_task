const express = require('express');
const router = express.Router();
const protectedRouter = express.Router();
let MoviesController = require('../controllers/movies');
let UsersController = require('../controllers/users');
let AuthController = require('../controllers/auth');

//Bots
protectedRouter.post('/movies', MoviesController.create);
protectedRouter.get('/movies/:id', MoviesController.getById);
protectedRouter.get('/movies', MoviesController.getAll);
protectedRouter.delete('/movies/:id', MoviesController.deleteById);
protectedRouter.patch('/movies/:id', MoviesController.updateById);
protectedRouter.post('/movies/import', MoviesController.import);

// //Categories
// router.post('/categories/new', CategoriesController.create);
// router.get('/categories/:id', CategoriesController.getById);
// router.get('/categories', CategoriesController.getAll);
// router.delete('/categories/:id/delete', CategoriesController.deleteById);
// router.put('/categories/:id/update', CategoriesController.updateById);

// //Users
router.post('/users', UsersController.create);
router.post('/sessions', AuthController.login);
// protectedRouter.get('/users/:id', authHelpers.adminRequired, UsersController.getById);
// protectedRouter.get('/users/:userId/giveadmin', authHelpers.adminRequired, UsersController.setAdmin);
// protectedRouter.get('/users/:userId/revokeadmin', authHelpers.adminRequired, UsersController.revokeAdmin);
// protectedRouter.put('/users/:userId/update', UsersController.updateById);
// protectedRouter.delete('/users/:id/delete', UsersController.deleteById);

// router.get('/me', authHelpers.loginRequired, async (req, res) => {
//     let user = await users.findByPk(req.user.id);
//     return res.status(200).send(user);
// });

module.exports = {
    protected: protectedRouter,
    unprotected: router
}
