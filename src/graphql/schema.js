import {makeExecutableSchema} from "graphql-tools";

import {resolvers} from "./resolvers";

const typeDefs = `
    type Query{
        users: [User]
        user(_id : ID!): User
        
        ingredients: [Ingredient]
        ingredient(_id: ID!): Ingredient

        recipes: [Recipe]
        recipe(_id: ID!): Recipe
    }

    type Mutation{
        createUser(input: UserInput!): User
        deleteUser(_id: ID!): User
        updateUser(_id: ID!, input: UserInput!): User
        login(email:String!, password:String!): AuthData
        
        createIngredient(input: IngredientInput!): Ingredient
        deleteIngredient(_id: ID!): Ingredient
        updateIngredient(_id: ID!, input: IngredientInput!): Ingredient

        createRecipe(input: RecipeInput): Recipe
        deleteRecipe(_id: ID!): Recipe
        updateRecipe(_id: ID!, input: RecipeInput): Recipe
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
    
    type Ingredient{
        _id: ID!
        name: String!
        image: String
    }
    
    input IngredientInput{
        name: String!
        image: String
    }
    
    type AuthData {
        userId: ID!
        token: String!
    }

    type Recipe{
        _id: ID!
        name: String!
        ingredients: [String]
        photo: String!
        video: String!
        description: String!
        steps: [String]
        star: String!
        status: Boolean!
        region: String!
        level: String!

    }

    input RecipeInput{
        name: String!
        ingredients: [String]
        photo: String!
        video: String!
        description: String!
        steps: [String]
        star: String!
        status: Boolean!
        region: String!
        level: String!
    }
`;

export default makeExecutableSchema({
        typeDefs: typeDefs,
        resolvers: resolvers
    }
)