import { readFileSync } from 'fs';
import { toNumber } from 'lodash';
import { join } from 'path';
import { createConnection, getConnection } from 'typeorm';
import { User } from './database/models/User';

const isDev = process.env.NODE_ENV == 'development';

const PG_HOST = process.env.PG_HOST;
const PG_PORT = toNumber(process.env.PG_PORT);
const PG_USERNAME = process.env.PG_USERNAME;
const PG_PASSWORD = process.env.PG_PASSWORD;
const PG_DATABASE = process.env.PG_DATABASE;

createConnection({
	type: 'postgres',
	host: PG_HOST,
	port: PG_PORT,
	username: PG_USERNAME,
	password: PG_PASSWORD,
	database: PG_DATABASE,
	entities: [__dirname + '/database/models/*.js'],
	synchronize: true,
	ssl: { ca: process.env.PG_CA_CERT },
	logging: false,
});
