var express = require('express')
var { MongoClient } = require('mongodb')

var router = express.Router()

const BOOK_LIST = [
  {
    title: 'War and Peace',
    genre: 'Historical Fiction',
    author: 'Lev Nikolayevich Tolstoy',
    bookId: 656,
    new: false,
    imageName: '656.jpg'
  },
  {
    title: 'Les Misérables',
    genre: 'Historical Fiction',
    author: 'Victor Hugo',
    bookId: 24280,
    new: true,
    imageName: '24280.jpg'
  },
  {
    title: 'The Time Machine',
    genre: 'Science Fiction',
    author: 'H. G. Wells',
    bookId: 777,
    new: false,
    imageName: ''
  },
  {
    title: 'A Journey into the Center of the Earth',
    genre: 'Science Fiction',
    author: 'Jules Verne',
    bookId: 778,
    new: false,
    imageName: ''
  },
  {
    title: 'The Dark World',
    genre: 'Fantasy',
    author: 'Henry Kuttner',
    bookId: 779,
    new: false,
    imageName: ''
  },
  {
    title: 'The Wind in the Willows',
    genre: 'Fantasy',
    author: 'Kenneth Grahame',
    bookId: 780,
    new: false,
    imageName: ''
  },
  {
    title: 'Life On The Mississippi',
    genre: 'History',
    author: 'Mark Twain',
    bookId: 781,
    new: false,
    imageName: ''
  },
  {
    title: 'Childhood',
    genre: 'Biography',
    author: 'Lev Nikolayevich Tolstoy',
    bookId: 782,
    new: false,
    imageName: ''
  }]

/* GET home page. */
router.get('/', function (req, res, next) {
  const url = process.env.URL
  const password = process.env.PASSWORD
  const user = process.env.USER
  const dbName = 'library';

  (async function mongo () {
    let client

    try {
      client = await MongoClient.connect(url, {
        auth: {
          user,
          password
        }
      })

      const db = client.db(dbName)
      // await db.collection('books').deleteMany()
      // console.log(books[0].hasOwnProperty("_id"))
      const books = await db.collection('books').find().toArray()

      if (books.length === 0) {
        console.log('add BOOK_LIST')
        const response = await db.collection('books').insertMany(BOOK_LIST)
        res.json(response)
      } else {
        console.log('show what is in database')
        res.json(books)
      }
    } catch (err) {
      res.send(err)
    }
  }())
})

module.exports = router
