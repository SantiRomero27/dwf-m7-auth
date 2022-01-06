import { DataTypes } from "sequelize";
import { sequelize } from "./connection";

// Define the User model
export const User = sequelize.define("User", {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    birthdate: DataTypes.DATE,
});
