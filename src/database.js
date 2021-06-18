import mongoose from "mongoose";

export async function connect() {
    try {
        await mongoose.connect("mongodb://localhost/kitchefDB", {
            useNewUrlParser: true
        });
        console.log("///DB is connected")

    } catch (e) {
        console.log('Something went wrong!');
        console.log(e);
    }
}