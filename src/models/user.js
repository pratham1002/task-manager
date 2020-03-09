const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    }, 
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be positive number");
            }
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email");
            }
        },
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 6) {
                throw new Error("Password too short");
            }
            if (value === "password") {
                throw new Error("Password cannot be password");
            }
        }
    },
    tokens: [ {
        token: {
            type: String,
            required: true
        }
    } ]
});

userSchema.statics.findbyCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Unable to login");
    }

    if (password !== user.password) {
        throw new Error("Unable to login");
    }

    return user;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "newcourse");

    user.tokens = user.tokens.concat({ token });

    await user.save();

    return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;