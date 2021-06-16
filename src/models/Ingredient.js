import {Schema, model} from "mongoose";

const ingredientSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: String
});

export default model('Ingredient', ingredientSchema);