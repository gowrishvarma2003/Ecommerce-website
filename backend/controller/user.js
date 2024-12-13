const express = require("express");
const path = require("path");
const User = require("../model/user");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
require("dotenv").config();


// create user
router.post("/create-user", upload.single("file"), async (req, res) => {
    console.log("create user");
    console.log(req.body);
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });
    if (userEmail) {
        const filename = req.file.filename;
        const filepath = `../uploads/${filename}`;
        fs.unlinkSync(filepath, (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "Error detecting file" });
            }
        });
        return next(new ErrorHandler("User already exists", 400));
    }
    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const user = {
        name: name,
        email: email,
        password: password,
        avatar: {
            public_id: filename, // Example public_id
            url: fileUrl,
        },
    };
    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
        await sendMail({
            email: user.email,
            subject: "Account Activation",
            message: `Please click on the link to activate your account: ${activationUrl}`,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
    console.log(user);
});

const createActivationToken = (user) => {
    console.log("ACTIVATION_SECRET:", process.env.ACTIVATION_SECRET);
    return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "35m" });
}


//Milestone -7 
router.post("/activation", catchAsyncErrors(async (req, res, next) => {
    console.log("we are hear");
    const { activation_token } = req.body;
    // console.log(activation_token);
    try {
        const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
        // console.log(newUser);
        if (!newUser) {
            return next(new ErrorHandler("Invalid token", 400));
        }
        // console.log(newUser);
        const { name, email, password, avatar } = newUser;
        console.log(name, email, password, avatar);
        let oUser = await User.findOne({ email });
        if (oUser) {
            console.log("User already exists");
            return next(new ErrorHandler("User already exists", 400));
        }
        console.log("User does not exist");
        let nuser = await User.create({
            name,
            email,
            avatar,
            password,
        });
        console.log("User created");
        sendToken(nuser, 200, res);
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Invalid token", 400));
    }
}
));

module.exports = router;

