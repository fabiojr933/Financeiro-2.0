import express from "express";
import CompanyController from './controllers/companyController';
import UserController from './controllers/userController';
import authorization  from './middleware/authorization';
import BankController from './controllers/bankController';
import Expense_categoryController from "./controllers/expense_categoryController";
import ExpenseController from './controllers/expenseController';
import RevenueController from './controllers/revenueController';
import InvoiceController from './controllers/invoiceController';
import LaunchController from './controllers/launchController';

const route = express.Router();

const companyController = new CompanyController();
const userController = new UserController();
const bankController = new BankController();
const expense_categoryController = new Expense_categoryController();
const expenseController = new ExpenseController();
const revenueController = new RevenueController();
const invoiceController = new InvoiceController();
const launchController = new LaunchController();

//companyController
route.post('/company', companyController.create);
route.put('/company',  companyController.update);
route.delete('/company',  companyController.eliminate);
route.get('/company/:id',  companyController.get);
route.get('/companyList', companyController.list);

//userController
route.post('/user', userController.create);
route.put('/user', authorization, userController.update);
route.delete('/user', userController.eliminate);
route.get('/user/:id', authorization, userController.get);
route.get('/userList',  userController.list);
route.post('/user/authenticate', userController.authenticate);
route.get('/user/logoff', authorization, userController.logoff);

//bankController
route.post('/bank', authorization, bankController.create);
route.delete('/bank/:id', authorization, bankController.eliminate);
route.get('/bank/:id', authorization, bankController.get);
route.get('/bankList', authorization, bankController.list);
route.put('/bank', authorization, bankController.update);

//expense_categoryController
route.post('/expenseCategory', authorization, expense_categoryController.create);
route.delete('/expenseCategory/:id', authorization, expense_categoryController.eliminate);
route.get('/expenseCategory/:id', authorization, expense_categoryController.get);
route.get('/expenseCategoryList', authorization, expense_categoryController.list);
route.put('/expenseCategory', authorization, expense_categoryController.update);

//ExpenseController
route.post('/expense', authorization, expenseController.create);
route.delete('/expense/:id', authorization, expenseController.eliminate);
route.get('/expense/:id', authorization, expenseController.get);
route.get('/expenseList', authorization, expenseController.list);
route.put('/expense', authorization, expenseController.update);

//revenueController
route.post('/revenue', authorization, revenueController.create);
route.delete('/revenue/:id', authorization, revenueController.eliminate);
route.get('/revenue/:id', authorization, revenueController.get);
route.get('/revenueList', authorization, revenueController.list);
route.put('/revenue', authorization, revenueController.update);

//invoiceController
route.post('/invoice', authorization, invoiceController.create)
route.delete('/invoice/:id', authorization, invoiceController.eliminate);
route.get('/invoice/:id', authorization, invoiceController.get);
route.get('/invoiceList', authorization, invoiceController.list);
route.put('/invoice', authorization, invoiceController.update);

//launchController
route.post('/launch', authorization, launchController.create);
route.delete('/launchEntrance', authorization, launchController.eliminateEntrance);
route.delete('/launchOutput', authorization, launchController.eliminateOutput);
route.get('/listEntrance', authorization, launchController.listEntrance);
route.get('/listOutput', authorization, launchController.listOutput);


export default route;