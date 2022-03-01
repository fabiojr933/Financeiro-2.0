import database from '../database/database';
import { Request, Response } from 'express';
import logger from '../logger/logger';
import moment from 'moment';
import bcryptjs from 'bcryptjs';

interface user {
    id: string;
    name: string;
    email: string;
}

class userController {

    async create(req: Request, res: Response) {
        var { name, email, password, telephone } = req.body;
        var company_id = Number(req.body.company_id);
        const salt = bcryptjs.genSaltSync();
        password = bcryptjs.hashSync(password, salt);
        const date = moment().format('YYYY-MM-DD');
        if (!name || !email || !password || !telephone || !company_id) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Verifique os campos obrigatorios'
            });
        };
        try {
            const trx = await database.transaction();
            const count_email = await trx('users').count('id as id').where({ 'email': email });
            if (count_email[0].id >= 1) {
                return res.status(400).json({
                    'resultado': 400,
                    'status': 'falha',
                    'messagem': 'Já existe um Email igual a esse'
                });
            }
            const data = {
                name, email, password, telephone, date, company_id
            }
            await trx('users').insert(data);
            await trx.commit();
            res.status(201).json({
                'resultado': 201,
                'status': 'sucesso',
                dados: data
            });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                'resultado': 500,
                'status': 'falha',
                'messagem': 'Erro, ação não foi bem sucedido'
            });
        }
    }
    async eliminate(req: Request, res: Response) {
        const id = req.body.id;
        if (!id || isNaN(id)) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Id é obrigatorio'
            });
        }
        try {
            const trx = await database.transaction();
            const count_company = await trx('bank').count('id as id').where({ 'user_id': id });
            console.log(count_company);
            if (count_company[0].id >= 1) {
                return res.status(400).json({
                    'resultado': 400,
                    'status': 'falha',
                    'messagem': 'Existe um usuario vinculado a uma conta bancaria! não é possivel excluir.'
                });
            }

            await trx('users').delete().where({ 'id': id });
            await trx.commit();
            return res.status(200).json({
                'resultado': 200,
                'status': 'sucesso',
                id: id
            });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                'resultado': 500,
                'status': 'falha',
                'messagem': 'Erro, ação não foi bem sucedido'
            });
        }
    }
    async get(req: Request, res: Response) {       
        const id = Number(req.params.id);
        if (!id || isNaN(id)) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Id é obrigatorio'
            });
        }
        try {
            const trx = await database.transaction();
            const dados = await trx('users').select('*').where({ 'id': id });
            await trx.commit();
            return res.status(200).json({
                'resultado': 200,
                'status': 'sucesso',
                dados: dados
            });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                'resultado': 500,
                'status': 'falha',
                'messagem': 'Erro, ação não foi bem sucedido'
            });
        }
    }
    async list(req: Request, res: Response) {
        try {
            const trx = await database.transaction();
            const dados = await trx('users').select('*');
            await trx.commit();
            return res.status(200).json({
                'resultado': 200,
                'status': 'sucesso',
                dados: dados
            });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                'resultado': 500,
                'status': 'falha',
                'messagem': 'Erro, ação não foi bem sucedido'
            });
        }
    }
    async update(req: Request, res: Response) {

        const id = Number(req.body.id);
        var { name, email, telephone, password } = req.body
        var company_id = Number(req.body.company_id);
        if (password != undefined) {
            const salt = await bcryptjs.genSaltSync();
            password = await String(bcryptjs.hashSync(password, salt));
        }
        const data = { name, email, password, telephone };
        try {
            const trx = await database.transaction();
            await trx('users').update(data).where({ 'id': id });
            await trx.commit();
            return res.status(200).json({
                'resultado': 200,
                'status': 'sucesso',
                id: id,
                dados: data
            });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                'resultado': 500,
                'status': 'falha',
                'messagem': 'Erro, ação não foi bem sucedido'
            });
        }
    }
    async authenticate(req: Request, res: Response) {
        var { email, password } = req.body;
        if (!email || !password || password === undefined) {
            return res.status(401).json({
                'resultado': 401,
                'status': 'falha',
                'messagem': 'Erro, Email e senha são obrigatorios'
            });
        }
        try {
            const trx = await database.transaction();
            const dados = await trx('users').innerJoin('company', 'company.id', '=', 'users.company_id')
                .select('users.*', 'company.token').where({ 'email': email });
            const dados_password = dados[0].password;
            if (!bcryptjs.compareSync(password, dados_password)) {
                return res.status(401).json({
                    'resultado': 401,
                    'status': 'falha',
                    'messagem': 'Senha invalida'
                });
            }
            return res.status(200).json({
                'resultado': 200,
                'status': 'sucesso',
                'messagem': 'Usuario logado com sucesso',
                dados: dados
            });

        } catch (error) {
            logger.error(error);
            return res.status(401).json({
                'resultado': 401,
                'status': 'falha',
                'messagem': 'Ação não foi bem sucedido'
            });
        }
    }
    async logoff(req: Request, res: Response) {

    }
};

export default userController;