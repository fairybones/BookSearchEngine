import { gql } from '@apollo/client';

// LOGIN_USER
export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
        token
        user {
            _id
            username
        }
    }
 }
`;

// ADD_USER
export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
        token
        user {
            _id
            username
        }
    }
 }
`;

// SAVE_BOOK
export const SAVE_BOOK = gql`
    mutation saveBook($authors: [String], $description: String, $title: String, $bookId: String, $image: String, $link: String) {
        _id
        username
        email
        savedBooks {
            _id
            authors
            description
            title
            bookId
            image
            link
        }
        bookCount
    }
`;

// REMOVE_BOOK
export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
        removeBook(bookId: $bookId) {
            _id
            username
            email
            savedBooks {
                _id
                authors
                description
                title
                bookId
                image
                link
            }
            bookCount
        }
    }
`;