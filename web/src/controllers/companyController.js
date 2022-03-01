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
                res.render('company/index', { sucesso: sucesso, erro: erro });
                return;
            }
        });
        res.render('company/index', { sucesso: sucesso, erro: erro, dados: dados });

    } catch (error) {
        req.flash('erro', 'Ops! Ocorreu algum erro');
        req.session.save(() => res.redirect('back'));
        logger.error(error);
        return;
    }


}
exports.new = async (req, res) => {
    var sucesso = req.flash('sucesso');
    var erro = req.flash('erro');
    sucesso = (sucesso == undefined || sucesso.length == 0) ? sucesso : sucesso;
    erro = (erro == undefined || erro.length == 0) ? erro : erro;
    res.render('company/new', { sucesso: sucesso, erro: erro });
}
exports.create = async (req, res) => {
    var { name, address, cnpj, telephone } = req.body;
    const data = { name, address, cnpj, telephone };
    try {
        var config = {
            method: 'POST',
            url: `${server}:${port_api}/${version}/company`,
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
                req.session.save(() => res.redirect('/company/index'));
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
exports.eliminate = async (req, res) => {
    var id = req.body.id;
    var data = { id };
    try {
        var config = {
            method: 'delete',
            url: `${server}:${port_api}/${version}/company`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(data),
        }

        await axios(config).then((response) => {
            var resultado = response.data['resultado'];
            if (resultado == 200) {
                req.flash('sucesso', 'Empresa exluida com sucesso');
                req.session.save(() => res.redirect('/company/index'));
            }
            else {
                req.flash('erro', `Ops! Ocorreu algum erro!`);
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
exports.edit = async (req, res) => {
    var id = req.params.id;
    try {
        var config = {
            method: 'get',
            url: `${server}:${port_api}/${version}/company/${id}`,
            headers: {
                'Content-Type': 'application/json',
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
                res.redirect('/company/index');
                return
            }
            res.render('company/edit', { dados: dados });
        })
    } catch (error) {
        logger.error(error);
        req.flash('erro', `Ops! Ocorreu algum erro! :( `);
        req.session.save(() => res.redirect('back'));      
        return;
    }
}
exports.update = async (req, res) => {
    var { name, address, cnpj, telephone } = req.body;
    var id = Number(req.body.id);
    const data = { name, address, cnpj, telephone, id };
    try {
        const config = {
            method: 'PUT',
            url: `${server}:${port_api}/${version}/company`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(data),
        }
        await axios(config).then((response) => {
            var resultado = response.data['resultado'];
            if(resultado == 200){
                req.flash('sucesso', `Empresa alterado com sucesso :)`,);
                req.session.save(() => res.redirect('/company/index'));
            }else {
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