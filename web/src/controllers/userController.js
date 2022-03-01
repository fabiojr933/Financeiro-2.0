const logger = require('../logger/logger');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const server = process.env.SERVER;
const port_api = process.env.PORT_API;
const version = process.env.VERSION;

exports.index = async (req, res) => {
    var sucesso = req.flash('sucesso');
    var erro = req.flash('erro');
    console.log(req.session.user);
    sucesso = (sucesso == undefined || sucesso.length == 0) ? sucesso : sucesso;
    erro = (erro == undefined || erro.length == 0) ? erro : erro;

    try {
        var config = {
            method: 'get',
            url: `${server}:${port_api}/${version}/userList`,
            headers: {
                'Content-Type': 'application/json'
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
                res.render('user/index', { sucesso: sucesso, erro: erro });
                return;
            }
        });
        res.render('user/index', { sucesso: sucesso, erro: erro, dados: dados });
    } catch (error) {
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

    try {
        var config = {
            method: 'get',
            url: `${server}:${port_api}/${version}/companyList`,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var dados = []
        await axios(config).then((response) => {
            var resultado = response.data['resultado'];
            var dados_empresa = response.data['dados'];
            dados_empresa.forEach(data => {
                dados.push(data);
            });
            if (resultado != 200) {
                res.render('user/index', { sucesso: sucesso, erro: erro });
                return;
            }
        });
        res.render('user/new', { sucesso: sucesso, erro: erro, dados: dados });

    } catch (error) {
        req.flash('erro', 'Ops! Ocorreu algum erro');
        req.session.save(() => res.redirect('back'));
        logger.error(error);
        return;
    }

}
exports.create = async (req, res) => {
    var { name, email, telephone, password, company_id } = req.body;
    const data = { name, email, telephone, password, company_id };
    try {
        var config = {
            method: 'POST',
            url: `${server}:${port_api}/${version}/user`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(data),
        }
        await axios(config).then((response) => {
            var resultado = response.data['resultado'];
            var status = response.data['status'];
            if (resultado == 201 || resultado == 200) {
                req.flash('sucesso', `cadastrado com ${status}`,);
                req.session.save(() => res.redirect('/user/index'));
            } else {
                req.flash('erro', 'Ops! Ocorreu algum erro');
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
    var data = { id };
    try {
        var config = {
            method: 'delete',
            url: `${server}:${port_api}/${version}/user`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(data),
        };
        await axios(config).then((response) => {
            var resultado = response.data['resultado'];
            if (resultado == 200) {
                req.flash('sucesso', 'Usuario excluido com sucesso');
                req.session.save(() => res.redirect('/user/index'));
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

exports.account = async (req, res) => {
    var sucesso = req.flash('sucesso');
    var erro = req.flash('erro');

    sucesso = (sucesso == undefined || sucesso.length == 0) ? sucesso : sucesso;
    erro = (erro == undefined || erro.length == 0) ? erro : erro;
    try {
        var user_id = Number(req.session.user.user_id);
        var token = req.session.user.token;
        const config = {
            method: 'get',
            url: `${server}:${port_api}/${version}/user/${user_id}`,
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + token,
            },

        }
        var dados = [];
        await axios(config).then((response) => {
            var resultado = response.data['resultado'];
            var dados_empresa = response.data['dados'];
            dados_empresa.forEach(data => {
                dados.push(data);
            });
            if (resultado != 200) {
                res.render('company/index', { sucesso: sucesso, erro: erro });
                return;
            }
        });
        res.render('user/account', { sucesso: sucesso, erro: erro, dados_user: dados });
    } catch (error) {
        logger.error(error);
        req.flash('erro', `Ops! Ocorreu algum erro! :( `);
        req.session.save(() => res.redirect('back'));
        return;
    }

}
exports.update = async (req, res) => {

    var { name, email, password, telephone } = req.body;
    var id = Number(req.body.id);
    var user_id = Number(req.session.user.user_id);
    var company_id = Number(req.session.user.company_id);
    var token = req.session.user.token;
    const data = { name, email, password, telephone, id, user_id, company_id };
    try {
        var config = {
            method: 'PUT',
            url: `${server}:${port_api}/${version}/user`,
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + token,
            },
            data: JSON.stringify(data),
        }
        await axios(config).then((response) => {
            var resultado = response.data['resultado'];
            if (resultado != 200) {
                res.redirect('user/account');
                return;
            }
        });
        req.flash('sucesso', 'Usuario atualizado com sucesso');
        res.redirect('/user/account');
    } catch (error) {
        logger.error(error);
        req.flash('erro', `Ops! Ocorreu algum erro! :(`);
        req.session.save(() => res.redirect('back'));
        return;
    }
}