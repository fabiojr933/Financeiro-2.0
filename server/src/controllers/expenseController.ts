import database from '../database/database';
import { Response, Request } from 'express';
import logger from '../logger/logger';

class expenseController {
    async create(req: Request, res: Response) {
        var name = req.body.name;
        var user_id = Number(req.headers.user_id);
        var company_id = Number(req.headers.company_id);
        var expense_category_id = Number(req.body.expense_category_id);

        if (!name || !company_id || !user_id || !expense_category_id) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Verifique os campos obrigatorios'
            });
        };
        try {
            const trx = await database.transaction();
            const data = { name, company_id, expense_category_id, user_id };
            await trx('expense').insert(data);
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
            await trx('expense').delete().where({ 'id': id, 'user_id': user_id, 'company_id': company_id });
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
        if (!id || !company_id || !user_id || id === undefined || company_id === undefined) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Verifique os campos obrigatorios'
            });
        };
        try {
            const trx = await database.transaction();
          const dados = await trx('expense').innerJoin('expense_category', 'expense_category.id', '=', 'expense.expense_category_id')
          .select('expense.*', 'expense_category.name').where({ 'expense.id': id, 'expense.company_id': company_id, 'expense.user_id': user_id });
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
            const dados = await trx('expense').select('*').where({ 'user_id': user_id, 'company_id': company_id });
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
        var name = req.body.name;
        const user_id = Number(req.headers.user_id);
        const company_id = Number(req.headers.company_id);
        if (!id || !company_id || !user_id) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Verifique os campos obrigatorios'
            });
        }
        try {
            const data = { name };
            const trx = await database.transaction();
            await trx('expense').update(data).where({ 'id': id, 'company_id': company_id, 'user_id': user_id});
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

export default expenseController;