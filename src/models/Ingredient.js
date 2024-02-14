import {Schema, model} from "mongoose";

const ingredientSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: String,
    regions: {
        type: [String],
        required: true,
        default: [ 'MX' ]
    }
});

export default model('Ingredient', ingredientSchema);