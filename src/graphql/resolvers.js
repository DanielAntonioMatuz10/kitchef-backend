import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailConfirmation from "../email";


export const resolvers = {
    Query: {
        users(_, {}, ctx) {
            if (!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }
            return User.find();
        },
        user(_, {_id}, ctx) {
            return ctx.isAuth ? User.findById(_id) : new Error('Unautheticated')
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
            ;
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
                expiresIn: '1h'
            });

            return {userId: user.id, token: token}
        },
    }
};