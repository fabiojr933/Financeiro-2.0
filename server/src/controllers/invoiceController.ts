import database from '../database/database';
import { Request, Response } from 'express';
import logger from '../logger/logger';
import moment from 'moment';

class invoiceController {
    async create(req: Request, res: Response) {
        var { bank, value_card, situation, bank_id } = req.body;
        var data = moment().format('YYYY-MM-DD');
        var company_id = Number(req.headers.company_id);
        var user_id = Number(req.headers.user_id);
        if (!bank || !company_id || !user_id || !value_card || !bank_id) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Verifique os campos obrigatorios'
            });
        }
        try {
            const trx = await database.transaction();
            const dado = { bank, value_card, situation, data, company_id, user_id, bank_id };
            await trx('invoice').insert(dado);
            await trx.commit();
            res.status(201).json({
                'resultado': 201,
                'status': 'sucesso',
                dados: dado
            })
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
        var id = Number(req.params.id);
        var company_id = Number(req.headers.company_id);
        var user_id = Number(req.headers.user_id);
        if (!id || !company_id || !user_id) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Verifique os campos obrigatorios'
            });
        }
        try {
            const trx = await database.transaction();
            await trx('invoice').delete().where({ 'id': id, 'company_id': company_id, 'user_id': user_id });
            await trx.commit();
            return res.status(200).json({
                'resultado': 200,
                'status': 'sucesso',
                id: id,
                company_id: company_id,
                user_id: user_id
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
        var id = Number(req.params.id);
        var user_id = Number(req.headers.user_id);
        var company_id = Number(req.headers.company_id);
        if (!id || !user_id || !company_id) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Verifique os campos obrigatorios'
            });
        }
        try {
            const trx = await database.transaction();
            const dados = await trx('invoice').select('*').where({ 'id': id, 'company_id': company_id, 'user_id': user_id });
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
        var user_id = Number(req.headers.user_id);
        var company_id = Number(req.headers.company_id);
        if (!user_id || !company_id) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Verifique os campos obrigatorios'
            });
        }
        try {
            const trx = await database.transaction();
            const dados = await trx('invoice').select('*').where({ 'user_id': user_id, 'company_id': company_id });
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
        const company_id = Number(req.headers.company_id);
        const user_id = Number(req.headers.user_id);
        var { bank, value_card, situation } = req.body;
        if (!id || !company_id || !user_id) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Verifique os campos obrigatorios'
            });
        }
        const data = { bank, value_card, situation };
        try {
            const trx = await database.transaction();
            await trx('invoice').update(data).where({ 'id': id, 'company_id': company_id, 'user_id': user_id });
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
}
export default invoiceController;