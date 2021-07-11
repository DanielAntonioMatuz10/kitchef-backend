import {Schema, model} from "mongoose"

const recipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    ingredients: {
        type: [String],
        required: true
    },

    detailedIngredients: {
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
        type: [String],
        required: true
    },

    stars: Number,

    status: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Active',
        required: true
    },

    regions: {
        type: [String],
        required: true
    },

    difficulty: {
        type: String,
        enum: ['Low', 'Medium', 'Hard'],
        default: 'Medium',
        required: true
    },

    mealType: {
        type: [String],
        enum: ['Breakfast', 'Lunch', 'Dinner'],
        required: true
    }
});

export default model('Recipe', recipeSchema);