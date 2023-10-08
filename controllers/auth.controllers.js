const passport = require('passport');
const User = require('../models/user.model')
const { StatusCodes } = require('http-status-codes')
const jwt = require("jsonwebtoken");
const { BadRequestError, UnauthenticatedError } = require('../errors');


/*-----------Login and register using email and password------------------- */

const register = async (req, res) => {
    const user = await User.create({ ...req.body });
    try {
        const token = user.createJWT();
        res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
        // const { name } = user;
        // res.redirect(`api/v1/user/${user.name}/dashboard`)
        // return;

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};



const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Please provide an email and password");
    }

    try {
        const user = await User.findOne({ email }).select("+password");



        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json(" Invalid credentials ");
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            throw new UnauthenticatedError("Invalid credentials");
        }
        const token = user.createJWT();
        res.status(StatusCodes.OK).json({ user: { name: user.name }, token, redirect: `/${user.name}/dashboard` });

        // const { name } = user;

        // res.redirect(`/${name}/dashboard`)
        // return;

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};






/*-----------Login and register using LinkedIn------------------- */



const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

const profile = async (req, res) => {
    try {
        let id = req.user.userId
        console.log(id)
        const user = await User.findById(id);
        res.status(StatusCodes.OK).json({
            success: true,
            data: user,

        })


    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

const logout = async (req, res) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        })
        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (error) {
        throw new BadRequestError("User not found");
    }
}

const deleteUser = async (req, res) => {
    try{
        const id = req.params.id;
        const user = await User.findByIdAndRemove(id);
        if(!user){
            throw new BadRequestError('User not found');
        }
        res.status(StatusCodes.OK).json({message: 'User deleted successfully'});
    }catch(error){
        throw new BadRequestError(error.message);
    }
}

const updateDetails = async ( req, res ) => {
    try {
        uploadProfilePicture(req, res, async (err) => {
            if(err){
                console.error(err);
            }

            uploadCoverPicture(req, res, async (err) => {
                if(err){
                    console.error(err);
                }

                const { 
                    name, 
                    email, 
                    mobileNo, 
                    address,
                    city,
                    state,
                    country,
                    zipCode,
                    profileCover,
                    profilePicture,
                    bio} = req.body;

                const update = {
                    name, 
                    email, 
                    mobileNo, 
                    address,
                    city,
                    state,
                    country,
                    zipCode,
                    profileCover,
                    profilePicture,
                    bio};

                if (req.file) {
                    if (req.file.fieldname === 'profilePicture') {
                        updates.profilePicture = req.file.filename;
                    } else if (req.file.fieldname === 'profileCover') {
                        updates.profileCover = req.file.filename;
                    }
                }
                
                const user = await User.findByIdAndUpdate(
                    req.user.id,
                    update,
                    {
                        new: true,
                        runValidators: true,
                        useFindAndModify: false
                    }
                );

                res.status(StatusCodes.OK).json({
                    success: true,
                    data: user
                });

                console.log(user);
            });
        });
    } catch (error) {
        throw new BadRequestError(error.message);
    }
}

const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try{
      const user = await User.findById(req.user.id).select('+password');
      if(!(await user.matchPassword(currentPassword))){
          throw new UnauthenticatedError("Password is incorrect");
      }
      user.password = newPassword;
      await user.save();
      res.status(StatusCodes.OK).json({
          success: true,
          message: "Password has been updated successfully"
      })
    }catch(error){
        throw new BadRequestError(error.message);
    }
}

module.exports = {
    register,
    login,
    getAllUsers,
    profile,
    logout,
    deleteUser,
    updateDetails,
    updatePassword
};
