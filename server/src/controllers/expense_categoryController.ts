import database from '../database/database';
import { Request, Response } from 'express';
import logger from '../logger/logger';

class expense_categoryController {
    async create(req: Request, res: Response) {      
        var name = req.body.name;
        var user_id = Number(req.headers.user_id);         
        var company_id = Number(req.headers.company_id);      
        if (!name || !company_id || !user_id || company_id === undefined || user_id === undefined) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Verifique os campos obrigatorios'
            });
        }
        const data = { name, company_id, user_id };
        try {
            const trx = await database.transaction();
            await trx('expense_category').insert(data);
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
        var id = req.params.id;
        var company_id = Number(req.headers.company_id);
        var user_id = Number(req.headers.user_id);
        if (!id || !company_id || !user_id || id === undefined || company_id === undefined) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Verifique os campos obrigatorios'
            });
        };
        try {
            const trx = await database.transaction();
            const count_expenseCategory = await trx('expense').count('id as id').where({ 'expense_category_id': id });
            if (count_expenseCategory[0].id >= 1) {
                return res.status(400).json({
                    'resultado': 400,
                    'status': 'falha',
                    'messagem': 'Existe uma despesa vinculado a essa tipo de categoria'
                });
            }
            await trx('expense_category').delete().where({ 'id': id, 'company_id': company_id, 'user_id': user_id });
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
    async get(req: Request, res: Response){
        var id = Number(req.params.id);
        var user_id = Number(req.headers.user_id);
        var company_id = Number(req.headers.company_id);
        if (!id || !company_id || id === undefined || company_id === undefined) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Verifique os campos obrigatorios'
            });
        };
        try {
            const trx = await database.transaction();
            const dados = await trx('expense_category').select('*').where({ 'id': id, 'company_id': company_id, 'user_id': user_id});
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
        if(!user_id || !company_id || user_id === undefined || company_id === undefined){
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Verifique os campos obrigatorios'
            });
        }
        try {
            const trx = await database.transaction();
            const dados = await trx('expense_category').select('*').where({'user_id': user_id, 'company_id': company_id});
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
        var { name} = req.body             
        const data = { name };       
        try {
            const trx = await database.transaction();
            await trx('expense_category').update(data).where({ 'id': id, 'company_id': company_id, 'user_id': user_id});
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

export default expense_categoryController;