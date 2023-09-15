import { GraphQLServer } from "graphql-yoga"

const typeDefs = `
    type Query{
        greeting(name: String): String!
        me: User!
    }

    type Post{
        id: ID!
        title: String!
        published: Boolean!
    }

    type User{
        id: ID!
        name: String!
        age: Int!
        isEmployed: Boolean!
        gpa: Float
        posts: Post!
    }
`

const resolvers = {
    Query: {
        greeting(parent, args, ctx, info){
            console.log(args);
            const { name } = args
            return `Hello ${name}`
        },
        me(){
            return{
                id: "abc123",
                name: "Ali Can Güneş",
                age: 27,
                isEmployed: true,
                gpa: 2.97,
                posts:{
                    id: "123",
                    title: "My first post!",
                    published: false
                }
            }
        }
    },
}

const server = new GraphQLServer({
    typeDefs: typeDefs,
    resolvers: resolvers
})

server.start(()=>{
    console.log('the server is up');
})