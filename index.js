const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Data
let books = {
    "books": [
      {
        "author": "Gabo", 
        "description": "Good one", 
        "id": 1, 
        "title": "La hojarasca"
      }, 
      {
        "author": "Gabo", 
        "description": "Interesting", 
        "id": 2, 
        "title": "El coronel no tiene quien le escriba"
      }
    ]
  };

// To get all the books
app.get('/books', (req, res) => {
    res.json(books);
});

// To add books
// For testing: curl -d '{"author":"Ray Bradbury", "description":"Dystopian novel published in 1953...", "title":"Farenheit 451"}' -H "Content-Type: application/json" -X POST http://192.168.56.3:3000/books
// For testing: curl -d '{"author":"Dostovieski", "description":"Follows the mental anguish and moral dilemmas of Rodion Raskolnikov...", "title":"Crime and Punishment"}' -H "Content-Type: application/json" -X POST http://192.168.56.3:3000/books
// For testing: curl -d '{"author":"Juan Diego", "description":"Jack Torrance becomes winter caretaker at the Overlook Hotel...", "title":"The Shining"}' -H "Content-Type: application/json" -X POST http://192.168.56.3:3000/books
app.post('/books', (req, res) => {
  try {
    let allBooks = books['books'];
    let theBook = req.body;
    let lastId = 0;

    for (let i = 0; i < allBooks.length; i++) {
      let theId = allBooks[i]['id'];
      if (lastId < theId) {
        lastId = theId;
      }
    }

    theBook['id'] = lastId + 1;
    allBooks.push(theBook);
    books['books'] = allBooks;

    res.json({'code': 200, 'message': "Book inserted successful", 'data': theBook});

  } catch (e) {
    console.log('There was an error while trying to do post petition to add a book...');
    console.log(e);
    res.json({'code': 500, 'message': "There was a server error"});
  }

});

// Edit a Book
// For testing: curl -i -H "Content-Type: application/json" -X PUT -d '{"author":"Stephen King"}' http://192.168.56.3:3000/books/5
app.put('/books/:bookId', (req, res) => {
    let bookId = req.params.bookId;

    let allBooks = books['books'];
    let theBook = {};
    let posBook = -1;

    for (let i = 0; i < allBooks.length; i++) {
      let theId = allBooks[i]['id'];
      if (bookId == theId) {
        posBook = i;
        theBook = allBooks[i];
      }
    }

    let theChanges = req.body;
    
    for (let theKey in theChanges) {
      theBook[theKey] = theChanges[theKey];
    }

    allBooks[posBook] = theBook;
    books['books'] = allBooks;

    if (posBook == -1) {
      res.json({'code': 300, 'message': 'Error. There is no book with that id'});
    } else {
      res.json({'code': 200, 'message': 'The changes were made with success', 'data': theBook});
    }
});

// Delete a Book
// For testing: curl -i -H "Content-Type: application/json" -X DELETE http://192.168.56.3:3000/books/1
app.delete('/books/:bookId', (req, res) => {
  let bookId = req.params.bookId;
  let allBooks = books['books'];
  let idFound = false;
  
  for (let i = 0; i < allBooks.length; i++) {
    let theId = allBooks[i]['id'];
    if (bookId == theId) {
      allBooks.splice(i, 1);
      idFound = true;
    }
  }

  books['books'] = allBooks;

  if (idFound) {
    res.json({'code': 200, 'message': 'The book was removed', 'data': allBooks});
  } else {
    res.json({'code': 300, 'message': 'There was not a book with the given id', 'data': allBooks});
  }
});

// Start listening server
app.listen(port, () => {
  console.log('Server listening on port %d', port);
});
