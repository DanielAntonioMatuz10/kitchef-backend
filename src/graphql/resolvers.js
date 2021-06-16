import User from "../models/User";
import Ingredient from "../models/Ingredient";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailConfirmation from "../email";


export const resolvers = {
    Query: {
        users(_, {}, ctx) {
            return ctx.isAuth ? User.find() : new Error('Unautheticated!');
        },

        user(_, {_id}, ctx) {
            return ctx.isAuth ? User.findById(_id) : new Error('Unautheticated')
        },

        ingredients(_, {}, ctx) {
            return ctx.isAuth ? Ingredient.find() : new Error('Unautheticated!');
        },

        ingredient(_, {_id}, ctx) {
            return ctx.isAuth ? Ingredient.findById(_id) : new Error('Unautheticated!');
        }
    },
    Mutation: {
        async createUser(_, {input}) {

            input.password = await bcrypt.hash(input.password, 12);

            const newUser = new User(input);
            await newUser.save();
            newUser.password = null;

            /*const emailToken = jwt.sign({user: newUser._id}, process.env.JWT_KEY, {expiresIn: '1d'});
            const url = `http://localhost:3000/confirmation/${emailToken}`;

            sendEmailConfirmation(newUser.email, newUser.firstName, url);*/

            return newUser;
        },

        deleteUser(_, {_id}, ctx) {
            return ctx.isAuth ? User.findByIdAndDelete(_id) : new Error('Unautheticated!');
        },

        updateUser(_, {_id, input}, ctx) {
            return ctx.isAuth ? User.findByIdAndUpdate(_id, input, {new: true}) : new Error('Unautheticated');
        },

        async login(_, {email, password}) {

            const user = await User.findOne({email: email});

            if (!user) {
                throw new Error('Invalid Credentials!');
            }

            /*if (user.status === 'Pending') {
                return new Error('Pending Account. Please Verify Your Email!')
            }*/

            const isEqual = await bcrypt.compare(password, user.password);

            if (!isEqual) {
                throw new Error('Invalid Credentials!');
            }


            const token = jwt.sign({userId: user.id, email: user.email}, process.env.JWT_KEY, {
                expiresIn: '365d'
            });

            return {userId: user.id, token: token}
        },

        /*verify(_, {id}) {
            return User.findByIdAndUpdate(id,{status : "Active"});
        }*/

        createIngredient(_, {input}, ctx){
            if (!ctx.isAuth){
                throw new Error('Unautheticated!');
            }
            const newIngredient = new Ingredient(input);
            return newIngredient.save();
        },

        deleteIngredient(_, {_id}, ctx){
            return ctx.isAuth ? Ingredient.findByIdAndDelete(_id) : new Error('Unautheticated!');
        },

        updateIngredient(_, {_id,input}, ctx){
            return ctx.isAuth ? Ingredient.findByIdAndUpdate(_id, input, {new: true}) : new Error('Unautheticated');
        },
    }
};