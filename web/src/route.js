const express = require('express');
const route = express.Router();

const companyController = require('./controllers/companyController');
const userController = require('./controllers/userController');
const loginController = require('./controllers/loginController');
const authenticate = require('./middlewares/authenticate');
const expenseCategoryController = require('./controllers/expenseCategoryController');
const bankController = require('./controllers/bankController');
const revenueController = require('./controllers/revenueController');
const expenseController = require('./controllers/expenseController');
const launchController = require('./controllers/launchController');



//companyController
route.get('/company/index', authenticate, companyController.index);
route.get('/company/new', authenticate, companyController.new);
route.post('/company/create', authenticate, companyController.create);
route.post('/company/eliminate', authenticate, companyController.eliminate);
route.get('/company/edit/:id', authenticate, companyController.edit);
route.post('/company/update', authenticate, companyController.update);

//userController
route.get('/user/new', authenticate, userController.new);
route.get('/user/index', authenticate, userController.index);
route.post('/user/create', authenticate, userController.create);
route.post('/user/eliminate', authenticate, userController.eliminate);
route.get('/user/account', authenticate, userController.account);
route.post('/user/update', authenticate, userController.update);

//loginController
route.get('/login/index', loginController.index);
route.post('/login/sign', loginController.Sign);
route.get('/login/logoff', loginController.logoff);

//expenseCategoryController
route.get('/expenseCategory/new', authenticate, expenseCategoryController.new);
route.post('/expenseCategory/create', authenticate, expenseCategoryController.create);
route.get('/expenseCategory/index', authenticate, expenseCategoryController.index);
route.post('/expenseCategory/eliminate', authenticate, expenseCategoryController.eliminate);
route.get('/expenseCategory/edit/:id', authenticate, expenseCategoryController.edit);
route.post('/expenseCategory/update', authenticate, expenseCategoryController.update);

//bankController
route.get('/bank/index', authenticate, bankController.index);
route.get('/bank/new', authenticate, bankController.new);
route.post('/bank/create', authenticate, bankController.create);
route.post('/bank/eliminate', authenticate, bankController.eliminate);
route.get('/bank/edit/:id', authenticate, bankController.edit);
route.post('/bank/update', authenticate, bankController.update);

//revenueController
route.get('/revenue/index', authenticate, revenueController.index);
route.get('/revenue/new', authenticate, revenueController.new);
route.post('/revenue/create', authenticate, revenueController.create);
route.post('/revenue/eliminate', authenticate, revenueController.eliminate);
route.get('/revenue/edit/:id', authenticate, revenueController.edit);
route.post('/revenue/update', authenticate, revenueController.update);

//expenseController
route.get('/expense/index', authenticate, expenseController.index);
route.get('/expense/new', authenticate, expenseController.new);
route.post('/expense/create', authenticate, expenseController.create);
route.post('/expense/eliminate', authenticate, expenseController.eliminate);

//launchController
route.get('/launch/index', authenticate, launchController.index);
route.post('/launch/create', authenticate, launchController.launch);

module.exports = route;