const express = require('express');
const router = express.Router();
const fs = require('fs');

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The book title
 *         author:
 *           type: string
 *           description: The book author
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

let bookFile;
// Getting the array of books to be used by all routes
fs.readFile('./db.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  bookFile = JSON.parse(data);
});

// Getting all books
router.get('/', (req, res, next) => {
  res.send(bookFile.books);
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */

// Getting book by id
router.get('/:id', (req, res, next) => {
  // Finding book by id, sending it if it exists
  let tempBook = bookFile.books.find(book => book.id == req.params.id);
  tempBook == undefined ? res.sendStatus(404) : res.send(tempBook);
});

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */

// Creating new book
router.post("/", (req, res) => {
// Pushing new book to temporay array and creating new file with that array
  const tempBook = bookFile;

  tempBook.books.push(req.body);

  fs.writeFile("./db.json", JSON.stringify(tempBook), (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  });
});

/**
 * @swagger
 * /books/{id}:
 *  put:
 *    summary: Update the book by the id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The book id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 */

// Updating book by id
router.put("/:id", (req, res) => {

  // Getting all books except the one with a matching id
  // pushing request body to array and creating new file
  let tempBook = bookFile.books.filter(book => book.id != req.params.id);

  tempBook.push(req.body);

  fs.writeFile("./db.json", JSON.stringify({ books: tempBook }), (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  });
});

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 * 
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */

// Deleting book by id
router.delete("/:id", (req, res) => {
  // Getting all books except one with matching id and creating new file
  let tempBook = bookFile.books.filter(book => book.id != req.params.id);

  fs.writeFile("./db.json", JSON.stringify({ books: tempBook }), (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  });
});

module.exports = router;
