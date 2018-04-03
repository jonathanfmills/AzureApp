var express = require('express')
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    let imgType = file.mimetype.replace('image/', '.')
    console.log(file)
    //cb(null, file.fieldname + '-' + Date.now())
    cb(null, file.originalname + imgType)
  }
})

var upload = multer({ storage: storage })
var path = require('path')
// var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var { MongoClient } = require('mongodb')

// routes
var index = require('./routes/index')
var users = require('./routes/users')
var admin = require('./routes/admin')
var detail = require('./routes/detail')
var add = require('./routes/add')
var del = require('./routes/delete')
var app = express()

// view engine setup
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))

// parse body middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', index)
app.use('/users', users)
app.use('/admin', admin)
app.use('/detail', detail)
app.use('/add', add)
app.use('/del', del)

// upload an image
app.post('/upload', upload.single('item'), function (req, res) {
  let response = {
    status: 200,
    success: 'Image Uploaded',
    body: req.file
  }
  // req.file is the `avatar` file
  // console.log(req.file)
  // req.body will hold the text fields, if there were any
  res.setHeader('Content-Type', 'text/plain')
  res.end(JSON.stringify(response), null, 2)
})

// remove one record
app.post('/del/:bookId', function (req, res) {
  (async function mongo () {
    let client
    const dbName = 'library'
    const url = process.env.URL
    const password = process.env.PASSWORD
    const user = process.env.USER

    try {
      client = await MongoClient.connect(url, {
        auth: {
          user,
          password
        }
      })
      let response = {
        status: 200,
        success: 'One record removed',
        body: req.body
      }
      const db = client.db(dbName)
      const myQuery = {
        'bookId': parseFloat(req.body.bookId)
      }
      await db.collection('books').deleteOne(myQuery)
      console.log('1 document removed')
      res.setHeader('Content-Type', 'text/plain')
      res.end(JSON.stringify(response), null, 2)
    } catch (err) {
      res.send(err)
    }
  }())
})

// create a new record
app.post('/add', function (req, res) {
  const dbName = 'library'
  const url = process.env.URL
  const password = process.env.PASSWORD
  const user = process.env.USER
  let response = {
    status: 200,
    success: 'One record added',
    body: req.body
  };

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
      const newValues = {
        'bookId': parseFloat(req.body.bookId),
        'imageName': req.body.imageName,
        'new': req.body.new === 'true' ? true : false,
        'title': req.body.title,
        'author': req.body.author,
        'genre': req.body.genre
      }
      await db.collection('books').insertOne(newValues)

      console.log('1 document added')
      res.setHeader('Content-Type', 'text/plain')
      res.end(JSON.stringify(response), null, 2)
    } catch (err) {
      res.send(err)
    }
  }())
})

// update one record
app.post('/edit', function (req, res) {
  const dbName = 'library'
  const url = process.env.URL
  const password = process.env.PASSWORD
  const user = process.env.USER
  let response = {
    status: 200,
    success: 'Updated Successfully',
    body: req.body
  };

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
      const myQuery = {'bookId': parseFloat(req.body.query)}
      const newValues = {
        $set: {
          'bookId': parseFloat(req.body.bookId),
          'hasImage': req.body.hasImage === 'true' ? true : false,
          'new': req.body.new === 'true' ? true : false,
          'title': req.body.title,
          'author': req.body.author,
          'genre': req.body.genre
        }
      }
      await db.collection('books').updateOne(myQuery, newValues)
      // const item = await db.collection('books').find({'bookId': parseFloat(itemID)}).toArray()

      console.log('1 document updated')
      res.setHeader('Content-Type', 'text/plain')
      res.end(JSON.stringify(response), null, 2)
    } catch (err) {
      res.send(err)
    }
  }())
})

// view details of one book
app.get('/details/:itemId', function (req, res) {
  const itemID = req.params.itemId
  const dbName = 'library'
  const url = process.env.URL
  const password = process.env.PASSWORD
  const user = process.env.USER;

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
      const item = await db.collection('books').find({'bookId': parseFloat(itemID)}).toArray()
      console.log(item)
      res.render('detail', {item})
    } catch (err) {
      res.send(err)
    }
  }())
})

// edit form for single record
app.get('/edit/:itemId', function (req, res) {
  const itemID = req.params.itemId
  const dbName = 'library'
  const url = process.env.URL
  const password = process.env.PASSWORD
  const user = process.env.USER;

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
      const item = await db.collection('books').find({'bookId': parseFloat(itemID)}).toArray()
      console.log(item)
      res.render('edit', {item})
    } catch (err) {
      res.send(err)
    }
  }())
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
