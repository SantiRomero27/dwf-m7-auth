import { Sequelize } from "sequelize";

// Database config
const sequelize = new Sequelize({
    dialect: "postgres",
    username: "shhukbfagcsfev",
    password:
        "c0ac9634ea79deea673b4829ae211c5258bd0c8a0933a1432a2e238ef0ed20d0",
    database: "d9cll2jg99825r",
    port: 5432,
    host: "ec2-54-83-152-251.compute-1.amazonaws.com",
    ssl: true,

    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

// Export
export { sequelize };
