var express = require("express")
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController");
var AdminAuth = require("../middleware/AdminAuth");

//  Get
router.get('/', HomeController.index);
router.get('/user', AdminAuth, UserController.index);
router.get('/user/:id', AdminAuth, UserController.findUser);

//  Post
router.post('/user', UserController.create);
router.post('/recoverpassword', UserController.recoverPassword);
router.post('/changepassword', UserController.changePassword);
router.post('/login', UserController.login);

//  Put
router.put('/user/:id', AdminAuth, UserController.updateUser);

//  Delete
router.delete('/user/:id', AdminAuth, UserController.delete);

module.exports = router;

