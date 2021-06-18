import { Schema, model } from "mongoose"

const recipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    ingredients: {
        type: [String],
        required: true
    },

    photo: {
        type: String,
        required: true
    },

    video: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    steps: {
        type: [String],
        required: true
    },

    star: {
        type: String,
        required: true
    },

    status: {
        type: Boolean,
        required: true
    },

    region: {
        type: String,
        required: true
    },

    level: {
        type: String,
        required: true
    }


});

export default model('Recipe', recipeSchema);