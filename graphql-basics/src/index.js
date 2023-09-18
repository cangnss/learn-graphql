import { GraphQLServer } from "graphql-yoga"
import uuidv4 from "uuid/v4"

// Demo user data

const users = [
    {
        id: "1",
        name: "Ali Can Güneş",
        age: 27,
        isEmployed: true,
        gpa: 2.97,
    },
    {
        id: "2",
        name: "Dilek Yalçın",
        age: 24,
        isEmployed: true,
        gpa: 3.12,
    },
    {
        id: "3",
        name: "Test test",
        age: 16,
        isEmployed: false,
        gpa: 2.2,
    },
]



const posts = [
    {
        id: "1",
        title: "First post",
        body: "First body",
        published: false,
        author: '1',
    },
    {
        id: "2",
        title: "Second post",
        body: "Second body",
        published: true,
        author: "2",
    },
    {
        id: "3",
        title: "Third post",
        body: "Third body",
        published: true,
        author: "3",
    },
    {
        id: "4",
        title: "Fourth post",
        body: "Fourth body",
        published: false,
        author: "1",
    },
]


const comments = [
    {
        id: "100",
        text: "This is a good post!",
        author: "1",
        post: "1"
    },
    {
        id: "101",
        text: "Awesome!",
        author: "1",
        post: "1"
    },
    {
        id: "102",
        text: "It is a good post!",
        author: "2",
        post: "2"
    },
    {
        id: "103",
        text: "Post is instructive!",
        author: "3",
        post: "3"
    },
]

const typeDefs = `
    type Query{
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
        me: User!
    }

    type Mutation{
        createUser(name: String!, age: Int!, isEmployed: Boolean!): User!
    }


    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type User{
        id: ID!
        name: String!
        age: Int!
        isEmployed: Boolean!
        gpa: Float
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Comment{
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

const resolvers = {
    Query: {
        users(parent, args, ctx, info){
            if (!args.query) {
                return users
            }

            return users.filter(user => {
                if (user.name.toLowerCase().includes(args.query.toLowerCase())) {
                    return user
                }
            })
        },
        posts(parent, args, ctx, info){
            if (!args.query) {
                return posts
            }

            return posts.filter(post => {
                if (post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())) {
                    return post
                }
            })
        },
        comments(parent, args, ctx, info){
            return comments;
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
    Mutation:{
        createUser(parent, args, ctx, info){
            console.log(args);
            const { name, age, isEmployed }= args
            const user = {
                id: uuidv4(),
                name,
                age,
                isEmployed
            }

            users.push(user)
            return user
        }
    },
    Post: {
        author(parent, args, ctx, info){
            return users.find(user => {
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info){
            return comments.filter(comment => {
                return comment.post === parent.id
            })
        }
    },
    User:{
        posts(parent, args, ctx, info){
            return posts.filter(post => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info){
            return comments.filter(comment => {
                return comment.author === parent.id
            })
        }
    },
    Comment:{
        author(parent, args, ctx, info){
            return users.find(user => {
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info){
            return posts.find(post => {
                return post.id === parent.post
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs: typeDefs,
    resolvers: resolvers
})

server.start(()=>{
    console.log('the server is up');
})