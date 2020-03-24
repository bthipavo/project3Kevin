import React, {useContext, useEffect, useState} from "react";
import DeleteBtn from "../components/DeleteBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";
import { LikeButton } from '../components/LikeButton';
import { UserContext } from '../context/UserContext';

const Books = () => {
  const [formData, setFormData] = useState({
    title: '',
    id: ''
  });
  const {users, setRecipes} = useContext(UserContext);

  const loadRecipes = () => {
    API.getRecipes()
      .then(res => {
        setRecipes(res.data)
      }
      )
      .catch(err => console.log(err));
  };

  useEffect(() => {
     if (users.length === 0) {
     loadRecipes();
     }
   }, []);

  const deleteBook = id => {
    API.deleteBook(id)
      .then(res => {
        const remainingBooks = users.filter(book => book._id !== id);
        setRecipes(remainingBooks);
      })
      .catch(err => console.log(err));
  };

  const incrementLikes = id => {
    console.log('id of book to increase likes', id, users);
    const indexToUpdate = users.findIndex(book => book._id === id);
    const newBooks = [...users];
    newBooks[indexToUpdate].likes = newBooks[indexToUpdate].likes ? newBooks[indexToUpdate].likes + 1 : 1;
    setRecipes(newBooks);

  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    })
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    
    const {id, title} = formData;

    if (title && id) {
      API.saveRecipe({
        title,
        id
      })
        .then(res => loadRecipes())
        .catch(err => console.log(err));
    }
  };

    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Jumbotron>
              <h1>What Books Should I Read?</h1>
            </Jumbotron>
            <form>
              <Input
                value={formData.title}
                onChange={handleInputChange}
                name="title"
                placeholder="Recipe Title (required)"
              />
              <Input
                value={formData.id}
                onChange={handleInputChange}
                name="id"
                placeholder="Recipe ID (required)"
              />
              <FormBtn
                disabled={!(formData.title && formData.id)}
                onClick={handleFormSubmit}
              >
                Submit Book
              </FormBtn>
            </form>
          </Col>
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>Books On My List</h1>
            </Jumbotron>
            {users.length ? (
              <List>
                {users.map(book => (
                  <ListItem key={book._id}>
                    <LikeButton id={book._id} incrementLikes={incrementLikes} likes={book.likes | 0} />
                    <Link to={"/users/" + book._id}>
                      <strong>
                        {book.title} by {book.author}
                      </strong>
                    </Link>
                    <DeleteBtn onClick={() => deleteBook(book._id)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
}

export default Books;
