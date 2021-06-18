import {Schema, model} from "mongoose";

const regionSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    ingredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }]
});

export default model('Region', regionSchema);