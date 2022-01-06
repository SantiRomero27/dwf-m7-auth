import { sequelize } from "./connection";
import "./models";

// Sync the database
sequelize.sync({ alter: true }).then(() => {
    console.log(">>> Database syncronization done!");
});
