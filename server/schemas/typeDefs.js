const typeDefs = `
    type Book {
        _id: ID
        authors: [String]
        description: String
        image: String
        link: String
        title: String
        bookId: String
    }

    type User {
        _id: ID
        username: String
        email: String
        savedBooks: [Book]
        bookCount: Int
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(authors: [String], description: String, title: String, bookId: String, image: String, link: String): User
        removeBook(bookId: String!): User
    }

    input BookInput {
        authors: [String]
        description: String
        image: String
        link: String
        title: String
        bookId: String
    }
`

module.exports = typeDefs;