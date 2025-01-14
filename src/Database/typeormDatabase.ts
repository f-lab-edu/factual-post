import path from 'path';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();
const dataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: true,
    entities: [
        path.join(__dirname, 'Entities', '*.ts'),
    ],
});

export default dataSource;
