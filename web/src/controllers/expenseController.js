const logger = require('../logger/logger');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const server = process.env.SERVER;
const port_api = process.env.PORT_API;
const version = process.env.VERSION;

exports.index = async (req, res) => {
    var sucesso = req.flash('sucesso');
    var erro = req.flash('error');

    sucesso = (sucesso == undefined || sucesso.length == 0) ? sucesso : sucesso;
    erro = (erro == undefined || erro.length == 0) ? erro : erro;

    var user_id = req.session.user.user_id;
    var company_id = req.session.user.company_id;
    var token = req.session.user.token;

    try {
        const config = {
            method: 'GET',
            url: `${server}:${port_api}/${version}/expenseList`,
            headers: {
                'Content-Type': 'application/json',
                user_id: user_id,
                company_id: company_id,
                authorization: 'Bearer ' + token,
            }
        }
        var dados = [];
        await axios(config).then((response) => {
            var resultado = response.data['resultado'];
            var dados_user = response.data['dados'];
            dados_user.forEach(data => {
                dados.push(data);
            });
            if (resultado != 200) {
                req.flash('error', 'Ops! Ocorreu algum erro')
                res.redirect('/');
                return;
            } else {
                res.render('expense/index', { sucesso: sucesso, erro: erro, dados: dados });
                return;
            }
        });
    } catch (error) {
        console.log(error)
        logger.error(error);
        req.flash('erro', 'Ops! Ocorreu algum erro');
        req.session.save(() => res.redirect('back'));
        return;
    }
}

exports.new = async (req, res) => {
    var sucesso = req.flash('sucesso');
    var erro = req.flash('erro');
    sucesso = (sucesso == undefined || sucesso.length == 0) ? sucesso : sucesso;
    erro = (erro == undefined || erro.length == 0) ? erro : erro;

    var user_id = req.session.user.user_id;
    var company_id = req.session.user.company_id;
    var token = req.session.user.token;

    try {
        const config = {
            method: 'GET',
            url: `${server}:${port_api}/${version}/expenseCategoryList`,
            headers: {
                'Content-Type': 'application/json',
                user_id: user_id,
                company_id: company_id,
                authorization: 'Bearer ' + token,
            }
        }
        var dados = [];
        await axios(config).then((response) => {
            var resultado = response.data['resultado'];
            var dados_user = response.data['dados'];
            dados_user.forEach(data => {
                dados.push(data);
            });
            if (resultado != 200) {
                req.flash('error', 'Ops! Ocorreu algum erro')
                res.redirect('/');
                return;
            } else {
                res.render('expense/new', { sucesso: sucesso, erro: erro, dados: dados});
                return;
            }
        });
    } catch (error) {
        logger.error(error);
        req.flash('erro', 'Ops! Ocorreu algum erro');
        req.session.save(() => res.redirect('back'));
        return;
    }    
}


exports.create = async (req, res) => {
    var { name, expense_category_id } = req.body;
    const data = { name, expense_category_id };
    var user_id = req.session.user.user_id;
    var company_id = req.session.user.company_id;
    var token = req.session.user.token;
    try {
        var config = {
            method: 'POST',
            url: `${server}:${port_api}/${version}/expense`,
            headers: {
                'Content-Type': 'application/json',
                user_id: user_id,
                company_id: company_id,
                authorization: 'Bearer ' + token,
            },
            data: JSON.stringify(data),
        }

        await axios(config).then((response) => {
            var resultado = response.data['resultado'];
            var status = response.data['status'];

            if (resultado == 201 || resultado == 200) {
                req.flash('sucesso', `cadastrado com ${status}`,);
                req.session.save(() => res.redirect('/expense/index'));
            } else {
                req.flash('erro', 'Ops! Ocorreu algum erro');
                req.session.save(() => res.redirect('back'));
                return;
            }
        });
    } catch (error) {
        logger.error(error);
        req.flash('erro', 'Ops! Ocorreu algum erro');
        req.session.save(() => res.redirect('back'));
        return;
    }
}


exports.edit = async (req, res) => {
    var sucesso = req.flash('sucesso');
    var erro = req.flash('erro');

    sucesso = (sucesso == undefined || sucesso.length == 0) ? sucesso : sucesso;
    erro = (erro == undefined || erro.length == 0) ? erro : erro;

    var id = req.params.id;
    var user_id = req.session.user.user_id;
    var company_id = req.session.user.company_id;
    var token = req.session.user.token;
    try {
        const config = {
            method: 'GET',
            url: `${server}:${port_api}/${version}/expense/${id}`,
            headers: {
                'Content-Type': 'application/json',
                user_id: user_id,
                company_id: company_id,
                authorization: 'Bearer ' + token,
            },
        }
        var dados = [];
        await axios(config).then((response) => {
            var resultado = response.data['resultado'];
            var dados_user = response.data['dados'];
            dados_user.forEach(data => {
                dados.push(data);
            });

            if (resultado != 200) {
                req.flash('erro', 'Ops! Ocorreu algum erro');
                res.redirect('expense/index');
                return;
            } else {
                res.render('expense/edit', { erro: erro, sucesso: sucesso, dados: dados });
                return;
            }
        })
    } catch (error) {
        logger.error(error);
        req.flash('erro', `Ops! Ocorreu algum erro! :( `);
        req.session.save(() => res.redirect('back'));
        return;
    }
}


exports.update = async (req, res) => {
    var { id, name } = req.body;
    var user_id = req.session.user.user_id;
    var company_id = req.session.user.company_id;
    var token = req.session.user.token;
    const data = { id, name };
    try {
        const config = {
            method: 'PUT',
            url: `${server}:${port_api}/${version}/expense`,
            headers: {
                'Content-Type': 'application/json',
                user_id: user_id,
                company_id: company_id,
                authorization: 'Bearer ' + token,
            },
            data: JSON.stringify(data)
        }

        await axios(config).then((response) => {
            var resultado = response.data['resultado'];
            if (resultado == 200) {
                req.flash('sucesso', 'Categoria atualizado com sucesso');
                req.session.save(() => res.redirect('/expense/index'));
            }
            else {
                req.flash('erro', `Ops! Ocorreu algum erro! `);
                req.session.save(() => res.redirect('back'));
                return;
            }
        });
    } catch (error) {
        logger.error(error);
        req.flash('erro', `Ops! Ocorreu algum erro! :( `);
        req.session.save(() => res.redirect('back'));
        return;
    }
}
exports.eliminate = async (req, res) => {
    var id = req.body.id;
    var user_id = req.session.user.user_id;
    var company_id = req.session.user.company_id;
    var token = req.session.user.token;
    try {
        var config = {
            method: 'delete',
            url: `${server}:${port_api}/${version}/expense/${id}`,
            headers: {
                'Content-Type': 'application/json',
                user_id: user_id,
                company_id: company_id,
                authorization: 'Bearer ' + token,
            },
        };
        await axios(config).then((response) => {
            var resultado = response.data['resultado'];

            if (resultado == 200) {
                req.flash('sucesso', 'Categoria excluido com sucesso');
                req.session.save(() => res.redirect('/expense/index'));
            }
            else {
                req.flash('erro', `Ops! Ocorreu algum erro! `);
                req.session.save(() => res.redirect('back'));
                return;
            }
        });
    } catch (error) {
        logger.error(error);
        req.flash('erro', `Ops! Ocorreu algum erro! :(`);
        req.session.save(() => res.redirect('back'));
        return;
    }
}