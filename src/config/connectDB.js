const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(
    process.env.DB_DATABASE_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,

    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: true,
        dialectOptions:
            process.env.DB_SSL === 'true' ?
                {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                } : {}
        ,
        // query: {
        //     raw: true
        // }
        timezone: "+07:00"
    })

// const sequelize = new Sequelize('book-library', 'root', null, {
//     host: 'localhost',
//     dialect: 'mysql',
// })


let connectDB = async () => {
    try {
        await sequelize.authenticate()
        console.log('connectDB successfully')
    } catch (error) {
        console.log('connectDB failure', error)
    }
}

module.exports = connectDB