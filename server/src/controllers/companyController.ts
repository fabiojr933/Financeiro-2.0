import database from '../database/database';
import { Request, Response } from 'express';
import logger from '../logger/logger';
import crypto from 'crypto';

class companyController {

    async create(req: Request, res: Response) {
        const { name, address, cnpj, telephone } = req.body;   
        const token = crypto.randomBytes(40).toString('hex');
        if (!name || !address || !cnpj || !telephone) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Verifique os campos obrigatorios'
            });
        };
        try {
            const trx = await database.transaction();
            const count_cnpj = await trx('company').count('id as id').where({'cnpj': cnpj});
            const count_token = await trx('company').count('id as id').where({'cnpj': token});
            if(count_cnpj[0].id >= 1 || count_token[0].id >= 1){
                return res.status(400).json({
                    'resultado': 400,
                    'status': 'falha',
                    'messagem': 'Já existe um CNPJ com esse numero'
                });
            }
            const data = {
                name, address, cnpj, telephone, token
            };
            await trx('company').insert(data);
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
    };

    async eliminate(req: Request, res: Response) {
        const id = Number(req.body.id);
        if (!id || isNaN(id)) {
            return res.status(400).json({
                'resultado': 400,
                'status': 'falha',
                'messagem': 'Id é obrigatorio'
            });
        }
        try {
            const trx = await database.transaction();
            const count_user = await trx('users').count('id as id').where({'company_id': id});
            if(count_user[0].id >= 1){
                return res.status(400).json({
                    'resultado': 400,
                    'status': 'falha',
                    'messagem': 'Você não pode excluir essa empresa! ela esta vinculada em um usuario'
                });
            }
            await trx('company').delete().where({ id: id });
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
    };

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
            const dados = await trx('company').select('*').where({ id: id });
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
    };

    async list(req: Request, res: Response) {
        try {
            const trx = await database.transaction();
            const dados = await trx('company').select('*');
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
    };

    async update(req: Request, res: Response) {
        const id = Number(req.body.id);
        const { name, address, cnpj, telephone } = req.body;
        const data = {
            name,
            address,
            cnpj,
            telephone
        };
        try {
            const trx = await database.transaction();
            const dados = await trx('company').update(data).where({ id: id });
            await trx.commit();
            return res.status(200).json({
                'resultado': 200,
                'status': 'sucesso',
                id: id,
                dados: data
            });
        } catch (error) {
            logger.error(error);
            return res.status(401).json({
                'resultado': 401,
                'status': 'falha',
                'messagem': 'Erro, ação não foi bem sucedido'
            });
        }
    }
};


export default companyController;