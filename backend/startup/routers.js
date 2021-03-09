const express = require('express')
const products = require('../routes/product')
const error = require('../middleware/errors')
const users = require('../routes/users')
const auth = require('../routes/auth')

module.exports = function (app) {
    app.use(express.json())
    app.use('/api/v1', products)
    app.use('/api/v1', users)
    app.use('/api/v1', auth)


    // error middleware
    app.use(error)
}