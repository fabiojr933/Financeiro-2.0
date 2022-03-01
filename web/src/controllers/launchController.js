const logger = require('../logger/logger');
const axios = require('axios');
const dotenv = require('dotenv');
const moment = require('moment');

dotenv.config();
const server = process.env.SERVER;
const port_api = process.env.PORT_API;
const version = process.env.VERSION;

exports.index = async (req, res) => {
    var sucesso = req.flash('sucesso');
    var erro = req.flash('erro');

    sucesso = (sucesso == undefined || sucesso.length == 0) ? sucesso : sucesso;
    erro = (erro == undefined || erro.length == 0) ? erro : erro;

    var user_id = req.session.user.user_id;
    var company_id = req.session.user.company_id;
    var token = req.session.user.token;

    const config = {
        method: 'GET',
        url: `${server}:${port_api}/${version}/bankList`,
        headers: {
            'Content-Type': 'application/json',
            user_id: user_id,
            company_id: company_id,
            authorization: 'Bearer ' + token,
        }
    }
    const config2 = {
        method: 'GET',
        url: `${server}:${port_api}/${version}/expenseList`,
        headers: {
            'Content-Type': 'application/json',
            user_id: user_id,
            company_id: company_id,
            authorization: 'Bearer ' + token,
        }
    }
    const config3 = {
        method: 'GET',
        url: `${server}:${port_api}/${version}/revenueList`,
        headers: {
            'Content-Type': 'application/json',
            user_id: user_id,
            company_id: company_id,
            authorization: 'Bearer ' + token,
        }
    }
    var dados_bank = [];
        await axios(config).then((response) => {
            var resultado_bank = response.data['resultado'];
            var dados = response.data['dados'];
            dados.forEach(data => {
                dados_bank.push(data);
            }); 
            if (resultado_bank != 200) {
                req.flash('error', 'Ops! Ocorreu algum erro')
                res.redirect('/');
                return;
            }
        });
    var dados_expense = [];
        await axios(config2).then((response) => {
            var resultado_expense = response.data['resultado'];
            var dados = response.data['dados'];
            dados.forEach(data => {
                dados_expense.push(data);
            }); 
            if (resultado_expense != 200) {
                req.flash('error', 'Ops! Ocorreu algum erro')
                res.redirect('/');
                return;
            }
        });
        var dados_revenue = [];
        await axios(config3).then((response) => {
            var resultado_revenue = response.data['resultado'];
            var dados = response.data['dados'];
            dados.forEach(data => {
                dados_revenue.push(data);
            }); 
            if (resultado_revenue != 200) {
                req.flash('error', 'Ops! Ocorreu algum erro')
                res.redirect('/');
                return;
            }
        });
    res.render('launch/launch', { sucesso: sucesso, erro: erro, bank: dados_bank, expense: dados_expense, revenue: dados_revenue});
};

exports.launch = async (req, res) => {
    var user_id = req.session.user.user_id;
    var company_id = req.session.user.company_id;
    var token = req.session.user.token;
    var data = moment().format('YYYY-MM-DD');
    var { revenue_id, description, balance, bank_id, expense_id} = req.body;
   
    try {
        var status = 'Entrada';
        const dados = {revenue_id, description, balance, bank_id, status, data};
        if(revenue_id){
            var config = {
                method: 'POST',
                url: `${server}:${port_api}/${version}/launch`,
                headers: {
                    'Content-Type': 'application/json',
                    user_id: user_id,
                    company_id: company_id,
                    authorization: 'Bearer ' + token,
                },
                data: JSON.stringify(dados),
            }   
            console.log(config)        
            await axios(config).then((response) => {
                var resultado = response.data['resultado'];
                var status = response.data['status'];
    
                if (resultado == 201 || resultado == 200) {
                    req.flash('sucesso', `Lançamento feito com ${status}`,);
                    req.session.save(() => res.redirect('/launch/index'));
                } else {
                    req.flash('erro', 'Ops! Ocorreu algum erro');
                    req.session.save(() => res.redirect('back'));
                    return;
                }
            });
        }
        if(expense_id){
            var status = 'Saida';
            const dados = {expense_id, description, balance, bank_id, status, data};
            var config = {
                method: 'POST',
                url: `${server}:${port_api}/${version}/launch`,
                headers: {
                    'Content-Type': 'application/json',
                    user_id: user_id,
                    company_id: company_id,
                    authorization: 'Bearer ' + token,
                },
                data: JSON.stringify(dados),
            }           
            await axios(config).then((response) => {
                var resultado = response.data['resultado'];
                var status = response.data['status'];
    
                if (resultado == 201 || resultado == 200) {
                    req.flash('sucesso', `Lançamento feito com ${status}`,);
                    req.session.save(() => res.redirect('/launch/index'));
                } else {
                    req.flash('erro', 'Ops! Ocorreu algum erro');
                    req.session.save(() => res.redirect('back'));
                    return;
                }
            });
        }
    } catch (error) {
        console.error(error)
        logger.error(error);
        req.flash('erro', 'Ops! Ocorreu algum erro');
        req.session.save(() => res.redirect('back'));       
        return;
    }
}