var express = require('express')
var router = express.Router()
var { MongoClient } = require('mongodb')

router.get('/', function (req, res, next) {
  /* GET del page. */
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
      await db.collection('books').deleteMany()
      console.log('truncated')
      res.render('delete')
    } catch (err) {
      res.send(err)
    }
  }())
})

module.exports = router
