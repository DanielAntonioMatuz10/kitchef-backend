import User from "../models/User";
import Ingredient from "../models/Ingredient";
import Region from "../models/Region";
import Recipe from "../models/Recipe";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailConfirmation from "../email";
import {async} from "regenerator-runtime";


export const resolvers = {
    Query: {
        users(_, {}, ctx) {
            return true ? User.find() : new Error('Unautheticated!');
        },

        user(_, {_id}) {
            /*return ctx.isAuth ? User.findById(_id) : new Error('Unautheticated')*/
            return User.findById(_id);
        },

        ingredients(_, {}, ctx) {
            return ctx.isAuth ? Ingredient.find() : new Error('Unautheticated!');
        },

        ingredient(_, {_id}, ctx) {
            return ctx.isAuth ? Ingredient.findById(_id) : new Error('Unautheticated!');
        },

        regions(_, {}, ctx) {
            return ctx.isAuth ? Region.find() : new Error('Unautheticated!');
        },

        region(_, {_id}, ctx) {
            return ctx.isAuth ? Region.findById(_id) : new Error('Unautheticated!');
        },

        recipes(_, {}, ctx) {
            return ctx.isAuth ? Recipe.find() : new Error('Unautheticated!');
        },

        recipe(_, {_id}, ctx) {
            return ctx.isAuth ? Recipe.findById(_id) : new Error('Unautheticated!');
        },

        async buildMealPlan(_, {_id, nMeals}, ctx) {

            if (!ctx.isAuth) {
                throw new Error('Unautheticated');
            }

            const user = await User.findById(_id);

            const recipes = await Recipe.find({regions: `${user.region}`})

            shuffle(recipes);

            const breakfastRecipes = [];
            const lunchRecipes = [];
            const dinnerRecipes = [];

            let i = 0;

            //keep looping until all three lists are full or already seen all recipes available
            while ((breakfastRecipes.length < nMeals || lunchRecipes.length < nMeals || dinnerRecipes.length < nMeals) && i < recipes.length) {
                const recipe = recipes[i];
                if (isRecipeCompatible(user, recipe)) {

                    if (breakfastRecipes < nMeals && recipe.mealType.includes("breakfast")) {
                        breakfastRecipes.push(recipe);
                    } else if (lunchRecipes < nMeals && recipe.mealType.includes("lunch")) {
                        lunchRecipes.push(recipe);
                    } else if (dinnerRecipes < nMeals && recipe.mealType.includes("dinner")) {
                        dinnerRecipes.push(recipe);
                    }
                }
                i++;
            }

            return [breakfastRecipes, lunchRecipes, dinnerRecipes];
        },

        async recommendation(_,{input}) {
            let regex = new RegExp(input);
            console.log(regex);
            return await Recipe.find({$or: [{name: {$regex: regex}}, {ingredients: {$regex: regex}}]});
        }
    },
    Mutation: {
        async createUser(_, {input}, ctx) {

            if (await User.findOne({phone:input.phone})){
                throw new Error('phone number already registered');
            }

            input.password = await bcrypt.hash(input.password, 12);

            const newUser = new User(input);
            await newUser.save();
            newUser.password = null;

            /*const emailToken = jwt.sign({user: newUser._id}, process.env.JWT_KEY, {expiresIn: '1d'});
            const url = `https://www.kitchef.mx/confirmation/${emailToken}`;

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

            if (user.status === 'Pending') {
                return new Error('Pending Account. Please Verify Your Email!')
            }

            const isEqual = await bcrypt.compare(password, user.password);

            if (!isEqual) {
                throw new Error('Invalid Credentials!');
            }


            const token = jwt.sign({userId: user.id, email: user.email}, process.env.JWT_KEY, {
                expiresIn: '365d'
            });

            return {userId: user.id, token: token}
        },

        verify(_, {_id}, ctx) {
            return User.findByIdAndUpdate(_id, {status: "Active"}, {new: true});
        },

        createIngredient(_, {input}, ctx) {
            if (!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }
            const newIngredient = new Ingredient(input);
            return newIngredient.save();
        },

        deleteIngredient(_, {_id}, ctx) {
            return ctx.isAuth ? Ingredient.findByIdAndDelete(_id) : new Error('Unautheticated!');
        },

        updateIngredient(_, {_id, input}, ctx) {
            return ctx.isAuth ? Ingredient.findByIdAndUpdate(_id, input, {new: true}) : new Error('Unautheticated');
        },

        createRegion(_, {input}, ctx) {
            if (!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }
            const newRegion = new Region(input);
            return newRegion.save();
        },

        deleteRegion(_, {_id}, ctx) {
            return ctx.isAuth ? Region.findByIdAndDelete(_id) : new Error('Unautheticated!');
        },

        updateRegion(_, {_id, input}, ctx) {
            return ctx.isAuth ? Region.findByIdAndUpdate(_id, input, {new: true}) : new Error('Unautheticated');
        },

        createRecipe(_, {input}) {
            
            const newRecipe = new Recipe(input)
            return newRecipe.save();
        },

        deleteRecipe(_, {_id}, ctx) {
            return ctx.isAuth ? Recipe.findByIdAndDelete(_id) : new Error('Unautheticated!');
        },

        updateRecipe(_, {_id, input}, ctx) {
            return ctx.isAuth ? Recipe.findByIdAndUpdate(_id, input, {new: true}) : new Error('Unautheticated!');
        },

        async addFavoriteRecipe(_, {_idUser, _idRecipe}, ctx) {
            if (!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }

            const user = await User.findById(_idUser);
            user.favoriteRecipes.push({_id: _idRecipe});
            await user.save();
            return user;
        },

        async removeFavoriteRecipe(_, {_idUser, _idRecipe}, ctx) {
            if (!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }

            const user = await User.findById(_idUser);
            user.favoriteRecipes.pull({_id: _idRecipe});
            await user.save();
            return user;
        }
    }
};


function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function isRecipeCompatible(user, recipe) {
    let cont = 0;

    const ingredients = recipe.ingredients;
    ingredients.forEach((ingredient) => {
        if (user.preferredIngredients.includes(ingredient)) {
            cont++;
        }
    })

    return cont / ingredients.length > 0.5;
}