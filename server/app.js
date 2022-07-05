const express = require('express'),
    path = require('path'),
    cors = require('cors'),
    app = express()
const port = +process.env.PORT || 8080,
    server = app.listen(port)
app.use(cors())
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json({ limit: '50mb' }))
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.static(path.join(__dirname, '../build')))
app.get('/todos', (req, res) => res.sendFile(path.join(__dirname, 'todos.json')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'))
})
app.post('/admin', (req, res) => {
    const neededLogin = 'admin',
        neededPassword = '123'
    const { login, password } = req.body,
        success = (neededLogin === login && neededPassword === password)
    res.json({ success })
})