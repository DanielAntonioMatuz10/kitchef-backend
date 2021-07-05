import {makeExecutableSchema} from "graphql-tools";

import {resolvers} from "./resolvers";

const typeDefs = `
    type Query{
        users: [User]
        user(_id : ID!): User
        
        ingredients: [Ingredient]
        ingredient(_id: ID!): Ingredient
        
        regions: [Region]
        region(_id: ID!): Region

        recipes: [Recipe]
        recipe(_id: ID!): Recipe
        
        buildMealPlan(_id: ID!, nMeals: Int!): [[Recipe]]
    }

    type Mutation{
        createUser(input: UserInput!): User
        deleteUser(_id: ID!): User
        updateUser(_id: ID!, input: UserInput!): User
        login(email:String!, password:String!): AuthData
        verify(_id: ID!): User
        
        createIngredient(input: IngredientInput!): Ingredient
        deleteIngredient(_id: ID!): Ingredient
        updateIngredient(_id: ID!, input: IngredientInput!): Ingredient
        
        createRegion(input: RegionInput!): Region
        deleteRegion(_id: ID!): Region
        updateRegion(_id: ID!, input: RegionInput!): Region
        
        createRecipe(input: RecipeInput): Recipe
        deleteRecipe(_id: ID!): Recipe
        updateRecipe(_id: ID!, input: RecipeInput): Recipe
    }
    
    type AuthData {
        userId: ID!
        token: String!
    }

    type User{
        _id: ID
        firstName: String
        lastName: String
        userName: String
        profilePic: String
        email: String
        phone: String
        password: String
        status: String
        region: String
        preferredIngredients : [String]
    }

    input UserInput{
        firstName: String!
        lastName: String!
        userName: String!
        profilePic: String
        email: String!
        phone: String
        password: String!
        region: String!
        preferredIngredients: [String]!
    }
    
    type Ingredient{
        _id: ID
        name: String
        image: String
        regions: [String]
    }
    
    input IngredientInput{
        name: String!
        image: String
        regions: [String]
    }
    
    type Region{
        _id: ID
        code: String
        name: String
        ingredients : [Ingredient]
    }
    
    input RegionInput{
        code: String!
        name: String!
    }
    
    type Recipe{
        _id: ID
        name: String
        ingredients: [String]
        photo: String
        video: String
        description: String
        steps: [String]
        stars: Float
        status: String
        regions: [String]
        difficulty: String
        mealType: [String]
    }

    input RecipeInput{
        name: String!
        ingredients: [String]
        photo: String!
        video: String
        description: String
        steps: [String]!
        stars: Float
        regions: [String]!
        difficulty: String!
        mealType: [String]!
    }
`;

export default makeExecutableSchema({
        typeDefs: typeDefs,
        resolvers: resolvers
    }
)