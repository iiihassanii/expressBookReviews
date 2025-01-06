const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  new Promise((resolve,reject)=>{
    if (books && Object.keys(books).length > 0)
    {
      resolve(books)
    }else{
      reject(new Error('No books found!'))
    }
  }).then(books=>{
    res.status(200).send(JSON.stringify(books,null,4));
  }).catch(error=>{
    res.status(500).send({ message: 'Failed to fetch books', error: error.message });
  })
  
});


public_users.get('/isbn/:isbn', function (req, res) {
  new Promise((resolve, reject) => {
    let isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject(new Error('No books found!'));
    }
  })
  .then(book => res.status(200).send(JSON.stringify(book, null, 4)))
  .catch(error => res.status(500).send({ message: 'Failed to fetch book', error: error.message }));
});

  

public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  let booksbyauthor = [];
  
  new Promise((resolve, reject) => {
    // Loop through the books to find those by the specified author
    for (let book in books) {
      if (books[book].author === author) {
        let addBook = {
          isbn: book,
          title: books[book].title,
          reviews: books[book].reviews,
        };
        booksbyauthor.push(addBook);
      }
    }
    if (booksbyauthor.length > 0) {
      resolve(booksbyauthor);
    } else {
      reject(new Error('Author not found!'));
    }
  })
  .then(authorBooks => res.status(200).send(JSON.stringify({"booksbyauthor": authorBooks}, null, 4))) // Send back the found books
  .catch(err => res.status(500).send({ message: 'Failed to fetch books', error: err.message })); // Handle errors
});



// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let booksbytitle = [];
  new Promise((reslove,reject)=>{
    for (let book in books){
      if(books[book].title === title)
      {
        let addBook = {
        isbn: book,
        author: books[book].author,
        reviews: books[book].reviews,
        }
        booksbytitle.push(addBook);
      }
    }
    if(booksbytitle.length>0)
    {
      reslove(booksbytitle);
    }else{
      reject(new Error("title doesn't exists"))
    }
  }).then(title=> res.status(200).send(JSON.stringify({"booksbytitle": title},null,4)))
  .catch(err => res.status(500).send({ message: 'Failed to fetch title', error: err.message }));
  
  
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.status(200).send(JSON.stringify({"bookreviews": books[isbn].reviews},null,4));
});

module.exports.general = public_users;
