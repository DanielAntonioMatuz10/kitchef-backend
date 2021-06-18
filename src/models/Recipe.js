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
        required: false
    },

    description: {
        type: String,
        required: false
    },

    steps: {
        type: String,
        required: true
    },

    star: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
        default: 0,
        required: true
    },

    status: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Pending',
        required: true
    },

    region: {
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        enum: ['Low', 'Medium', 'Hard'],
        default: 'Medium',
        required: true
    }


});

export default model('Recipe', recipeSchema);