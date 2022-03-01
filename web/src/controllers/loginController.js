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
    res.render('login/index', { sucesso: sucesso, erro: erro });
}
exports.Sign = async (req, res) => {
    var sucesso = req.flash('sucesso');
    var erro = req.flash('erro');

    sucesso = (sucesso == undefined || sucesso.length == 0) ? sucesso : sucesso;
    erro = (erro == undefined || erro.length == 0) ? erro : erro;

    var { email, password } = req.body;
    const data = { email, password };
    console.log(data);
    try {
        var config = {
            method: 'POST',
            url: `${server}:${port_api}/${version}/user/authenticate`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        }
        var dados = [];
        await axios(config).then((response) => {
            var resultado = response.data['resultado'];
            var dados_user = response.data['dados'];
            dados_user.forEach(data => {
                dados.push(data);
            });
            if (resultado != 200) {
                res.render('login/index', { sucesso: sucesso, erro: erro });
                return;
            }
            req.session.user = {
                user_id: dados[0].id,
                name: dados[0].name,
                company_id: dados[0].company_id,
                token: dados[0].token
            };
            res.redirect('/');
        });
    } catch (error) {
        logger.error(error);
        req.flash('erro', `Ops! Ocorreu algum erro! :(  `);
        req.session.save(() => res.redirect('back'));
        return;
    }
}
exports.logoff = async (req, res) => {
    try {
        req.session.user = undefined;
        res.redirect('/login/index');
    } catch (error) {
        logger.error(error);
        req.flash('erro', `Ops! Ocorreu algum erro! :( `);
        req.session.save(() => res.redirect('back'));
    }
}