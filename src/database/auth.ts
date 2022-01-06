import { DataTypes } from "sequelize";
import { sequelize } from "./connection";

// Define the Auth model
export const Auth = sequelize.define("Auth", {
    email: DataTypes.STRING,
    password: DataTypes.STRING,

    // Foreign key, in order to link with the users table
    user_id: DataTypes.INTEGER,
});
