import express from "express";
import cors from "cors";

import {graphqlHTTP} from "express-graphql";
import schema from "./graphql/schema";
import {connect} from "./database";
import {config} from "dotenv";
import isAuth from "./middleware/is-auth";

//For babel to work properly
import "core-js/stable";
import "regenerator-runtime/runtime";

config();

const app = express();
connect();

app.use(isAuth);
app.use(cors);

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}));

const port = process.env.PORT;
app.listen(port, () => console.log(`Server on port ${port}`));