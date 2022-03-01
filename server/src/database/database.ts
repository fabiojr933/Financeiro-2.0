import knex from "knex";
import dotenv from 'dotenv';

dotenv.config();
const pg_database = process.env.DATABASE_NAME;
const pg_host = process.env.DATABASE_HOST;
const pg_user = process.env.DATABASE_USER;
const pg_password = process.env.DATABASE_PASSWORD;
const pg_port = Number(process.env.DATABASE_PORT);

const database = knex({
    client: 'pg',
    version: '9.5',
    connection: {
        host: pg_host,
        port: pg_port,
        user: pg_user,
        password: pg_password,
        database: pg_database
    }
});

export default database;