import {makeExecutableSchema} from "graphql-tools";

import {resolvers} from "./resolvers";

const typeDefs = `
    type Query{
        users: [User]
        user(_id : ID!): User
    }

    type Mutation{
        createUser(input: UserInput): User
        deleteUser(_id: ID): User
        updateUser(_id: ID, input: UserInput): User
        login(email:String!, password:String!): AuthData
    }

    type User{
        _id: ID!
        firstName: String!
        lastName: String!
        userName: String!
        profilePic: String
        email: String!
        phone: String
        password: String
        status: String
    }

    input UserInput{
        firstName: String!
        lastName: String!
        userName: String!
        profilePic: String
        email: String!
        phone: String
        password: String!
    }
    
    type AuthData {
        userId: ID!
        token: String!
    }
`;

export default makeExecutableSchema({
        typeDefs: typeDefs,
        resolvers: resolvers
    }
)