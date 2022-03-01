import database from '../database/database';
import { Response, Request } from 'express';
import logger from '../logger/logger';
import moment from 'moment';

class launchController {
    async create(req: Request, res: Response) {
        var expense_id = req.body.expense_id;
        var revenue_id = req.body.revenue_id;
        var data = moment().format('YYYY-MM-DD');
        var user_id = Number(req.headers.user_id);
        var company_id = Number(req.headers.company_id);
        try {
            if (expense_id) {
                // type entrada
                var { status, description, balance, bank_id } = req.body;
                if (!user_id || !company_id || !status || !description || !balance || !bank_id) {
                    return res.status(400).json({
                        'resultado': 400,
                        'status': 'falha',
                        'messagem': 'Verifique os campos obrigatorios'
                    });
                }
                const trx = await database.transaction();
                const dados = { user_id, company_id, status, description, balance, bank_id, data, expense_id };
                await trx('launch_output').insert(dados);
                const money = await trx('bank').select('bank.balance').where({ 'id': bank_id, 'user_id': user_id, 'company_id': company_id });
                const value = Number(money[0].balance) - Number(balance);
                console.log(value, balance);
                if (Number(money[0].balance) < balance) {
                    return res.status(400).json({
                        'resultado': 400,
                        'status': 'falha',
                        'messagem': 'Você não possuem saldo suficiente para realizar essa operação',
                    });
                }
                await trx('bank').update({ 'balance': value }).where({ 'id': bank_id, 'user_id': user_id, 'company_id': company_id });
                await trx.commit();
                res.status(201).json({
                    'resultado': 201,
                    'status': 'sucesso',
                    dados: dados
                });
            }
            if (revenue_id) {
                // type entrada
                var { status, description, balance, bank_id } = req.body;
                if (!user_id || !company_id || !status || !description || !balance || !bank_id) {
                    return res.status(400).json({
                        'resultado': 400,
                        'status': 'falha',
                        'messagem': 'Verifique os campos obrigatorios'
                    });
                }
                const trx = await database.transaction();
                const dados = { user_id, company_id, status, description, balance, bank_id, data, revenue_id };
                await trx('launch_entrance').insert(dados);
                const money = await trx('bank').select('bank.balance').where({ 'id': bank_id, 'user_id': user_id, 'company_id': company_id });
                const value = Number(money[0].balance) + Number(balance);
                await trx('bank').update({ 'balance': value }).where({ 'id': bank_id, 'user_id': user_id, 'company_id': company_id });
                await trx.commit();
                res.status(201).json({
                    'resultado': 201,
                    'status': 'sucesso',
                    dados: dados
                });
            }
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                'resultado': 500,
                'status': 'falha',
                'messagem': 'Erro, ação não foi bem sucedido'
            });
        }

    }
    async eliminateEntrance(req: Request, res: Response) {
        var id = req.body.id;
        var user_id = Number(req.headers.user_id);
        var company_id = Number(req.headers.company_id);
        if (!id || !company_id || !user_id) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Id é obrigatorio'
            });
        }
        try {
            const trx = await database.transaction();
            const bankEntrance = await trx('launch_entrance').select('launch_entrance.bank_id').where({ 'id': id, 'user_id': user_id, 'company_id': company_id });
            var bank_id = Number(bankEntrance[0].bank_id);          
            const money = await trx('bank').select('bank.balance').where({ 'id': bank_id, 'user_id': user_id, 'company_id': company_id });
            const balance = await trx('launch_entrance').select('launch_entrance.balance').where({ 'id': id, 'user_id': user_id, 'company_id': company_id });
            const value = Number(money[0].balance) - Number(balance[0].balance);
            await trx('bank').update({ 'balance': value }).where({ 'id': bank_id, 'user_id': user_id, 'company_id': company_id });
            await trx('launch_entrance').delete().where({ 'id': id, 'company_id': company_id, 'user_id': user_id });
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

    
    async eliminateOutput(req: Request, res: Response) {
        var id = req.body.id; 
        var user_id = Number(req.headers.user_id);
        var company_id = Number(req.headers.company_id);
        if (!id || !company_id || !user_id) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Id é obrigatorio'
            });
        }
        try {
            const trx = await database.transaction();
            const bankOutput = await trx('launch_output').select('launch_output.bank_id').where({ 'id': id, 'user_id': user_id, 'company_id': company_id });
            var bank_id = Number(bankOutput[0].bank_id);          
            const money = await trx('bank').select('bank.balance').where({ 'id': bank_id, 'user_id': user_id, 'company_id': company_id });
            const balance = await trx('launch_output').select('launch_output.balance').where({ 'id': id, 'user_id': user_id, 'company_id': company_id });
            const value = Number(money[0].balance) + Number(balance[0].balance);
            await trx('bank').update({ 'balance': value }).where({ 'id': bank_id, 'user_id': user_id, 'company_id': company_id });
            await trx('launch_output').delete().where({ 'id': id, 'company_id': company_id, 'user_id': user_id });
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

    async listOutput(req: Request, res: Response) {
        var user_id = Number(req.headers.user_id);
        var company_id = Number(req.headers.company_id);
        if (!user_id || !company_id || user_id === undefined || company_id === undefined) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Verifique os campos obrigatorios'
            });
        }
        try {
            const trx = await database.transaction();
            const dados = await trx('launch_output').select('*').where({ 'user_id': user_id, 'company_id': company_id });
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

    async listEntrance(req: Request, res: Response) {
        var user_id = Number(req.headers.user_id);
        var company_id = Number(req.headers.company_id);
        if (!user_id || !company_id || user_id === undefined || company_id === undefined) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Verifique os campos obrigatorios'
            });
        }
        try {
            const trx = await database.transaction();
            const dados = await trx('launch_entrance').select('*').where({ 'user_id': user_id, 'company_id': company_id });
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
}



export default launchController;