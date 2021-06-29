import {Schema, model} from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        index: {
            unique: true,
            partialFilterExpression: {phone: {$type: 'string'}},
        },
        set: v => (v === '' ? null : v)
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Pending'
    },
    region:{
        type: String,
        required : true,
    },

    //TODO: For the future: It may be better to have all user preferences in a separated collection `userPreferences`

    preferredIngredients:{
        type:[String],
        required:true
    },

    favoriteRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe'}]  
});

export default model('User', userSchema);