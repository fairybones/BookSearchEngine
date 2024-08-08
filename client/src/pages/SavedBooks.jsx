import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Container, Col, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { GET_ME } from '../utils/queries';
import { removeBookId } from '../utils/localStorage';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
    const { username } = useParams();

    const { loading, data } = useQuery(GET_ME, {
        // var obj must match the query definition 
        variables: { username: username },
    });

    const userData = data?.me || {};

    const [removeBook, { error }] = useMutation(REMOVE_BOOK);
    // function that accepts the book's mongo _id value as param and deletes the book from the database
    const handleDeleteBook = async (bookId) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }
        try {
            const response = await removeBook({
                variables: { bookId },
            });
            if (!response.ok) {
                throw new Error('Cannot delete book');
            }
            // also remove bookId from localStorage
            removeBookId(bookId);
        } catch (err) {
            console.log(err, 'Removing bookId was unsuccessful')
        }
    };
    if (loading) {
        return <h2>LOADING...</h2>;
    }
    return (
        <>
          <div fluid className="text-light bg-dark p-5">
            <Container>
              <h1>Viewing saved books!</h1>
            </Container>
          </div>
          <Container>
            <h2 className='pt-5'>
              {userData.savedBooks.length
                ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
                : 'You have no saved books!'}
            </h2>
            <Row>
              {userData.savedBooks.map((book) => {
                return (
                  <Col key={book.bookId} md="4">
                    <Card border='dark'>
                      {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                      <Card.Body>
                        <Card.Title>{book.title}</Card.Title>
                        <p className='small'>Authors: {book.authors}</p>
                        <Card.Text>{book.description}</Card.Text>
                        <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                          Delete this Book!
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </>
      );
    };
    
export default SavedBooks;

