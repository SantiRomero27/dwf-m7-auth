import * as express from "express";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { Auth } from "./database/models";
import { User } from "./database/models";

// Hash function
function stringToHash(text: string) {
    return crypto.createHash("sha256").update(text).digest("hex");
}

// Web Token config
const SECRET_TOKEN = "token-test";

// Server config
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// Signup
app.post("/auth", async (req, res) => {
    // First, get the parameters sent by the user
    const { username, email, birthdate, password } = req.body;

    // Create/find the user
    const [userRes, userFlag] = await User.findOrCreate({
        where: { email },
        defaults: {
            email,
            username,
            birthdate,
        },
    });

    // If the user is not created, don't make the authentication
    if (!userFlag) {
        res.json({
            userFlag,
        });

        return;
    }

    // Make the authentication
    const [, authFlag] = await Auth.findOrCreate({
        where: { user_id: userRes.getDataValue("id") },
        defaults: {
            email,
            password: stringToHash(password),
            user_id: userRes.getDataValue("id"),
        },
    });

    res.json({
        message: "User created successfully!",
        userRes,
        authFlag,
    });
});

// Signin
app.post("/auth/token", async (req, res) => {
    // Get the body parameters
    const { email, password } = req.body;

    // Hash the password
    const hashedPassword = stringToHash(password);

    // Query the auth table, in order to get or not the user
    const foundUser = await Auth.findOne({
        where: { email, password: hashedPassword },
    });

    // If the user is found, send the token...
    if (foundUser) {
        const token = jwt.sign(
            { userId: foundUser.getDataValue("user_id") },
            SECRET_TOKEN
        );

        res.json({
            token,
        });
    }

    // If it is not found...
    else {
        res.json({
            error: "Incorrect email or password!",
        });
    }
});

// Middleware
async function authMiddleware(req, res, next) {
    // Get the authorization header
    const { authorization } = req.headers;

    // Check if the header exists
    if (!authorization) {
        res.status(400).json({ error: "Missing header" });

        return;
    }

    // Get the token
    const sentToken = authorization.split(" ")[1];

    // Decrypt the token
    try {
        const userData = jwt.verify(sentToken, SECRET_TOKEN);

        // Assign the data to the request
        req._user = userData;

        // Go to the next middleware
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid secret token key" });
    }
}

// Get the user data
app.get("/me", authMiddleware, async (req, res) => {
    // Get the request data, when the token is valid ---> After getting it from the Middleware
    const userId = req._user.userId;

    // Search the user
    const user = await User.findByPk(userId);

    res.status(200).json(user);
});

// Listen to requests
app.listen(PORT, () => {
    console.log(`> App listening to port ${PORT}`);
});
