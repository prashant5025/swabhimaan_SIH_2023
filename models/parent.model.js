const mongoose = require('mongoose')
const { Schema } = mongoose;
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose");



const ParentSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [50, "Name must be at most 50 characters long"],

    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,

    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password must be at least 6 characters long"],

    },
    role: {
        type: String,
        enum: ['user', 'parent', 'admin'],
        default: 'parent'
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
}, { timestamps: true });


ParentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})


ParentSchema.method.createJWT = function () {
    return jwt.sign({
        userId: this._id, name: this.name
    },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE,
        }
    )
}

ParentSchema.method.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

ParentSchema.method.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}


ParentSchema.plugin(passportLocalMongoose, {
    usernameField: "email",
    usernameLowerCase: true,
    session: false,
    errorMessages: {
        UserExistsError: "A user with the given email is already registered",
    },
});

module.exports = mongoose.model("Parent", ParentSchema);