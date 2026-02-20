import database from 'divhunt/database';

database.Item({
    id: 'primary',
    hostname: process.env.DB_HOSTNAME,
    username: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
});
