import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "../validations/envValidation";

const sslConfiguration =
	process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false;

export const AppDataSource = new DataSource({
	type: "postgres",
	host: env.DB_HOST,
	port: env.DB_PORT,
	username: env.DB_USERNAME,
	password: env.DB_PASSWORD,
	database: env.DB_DATABASE,
	synchronize: false,
	logging: false,
	ssl: sslConfiguration,
	entities: [`${__dirname}/entities/*{.ts,.js}`],
	migrations: [`${__dirname}/migrations/*{.ts,.js}`],
});
