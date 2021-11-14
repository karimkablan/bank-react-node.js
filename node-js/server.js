// npm i cors
//npm i nodemon
//npm i express
//npm i axios
//npm i body-parser
//npm i uniqid
const uniqid = require('uniqid');
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const app = express()
const fs = require('fs')
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



app.get('/', (req, res) => {
    if (!fs.existsSync('./bank.json')) {
        fs.writeFileSync('./bank.json', '[]')
    }
    const buffer = JSON.parse(fs.readFileSync('./bank.json').toString())
    res.status(200).json(buffer)
})


app.put('/updateMoney', (req, res) => {
    let buffer = JSON.parse(fs.readFileSync('./bank.json').toString())
    const users = buffer.find(itm => itm.accountNumber === req.body.accountNumber);
    if (users) {
        users.money += parseFloat(req.body.amount);
        fs.writeFileSync('./bank.json', JSON.stringify(buffer))
        res.status(200).send(users)
}
    else {
        res.status(406).json("the users is not exist")
    }

})

app.put('/updateCredit', (req, res) => {
    let buffer = JSON.parse(fs.readFileSync('./bank.json').toString())
    const users = buffer.find(itm => itm.accountNumber === req.body.accountNumber);
    if (users) {
        users.credit = parseFloat(req.body.credit);
        fs.writeFileSync('./bank.json', JSON.stringify(buffer))
        res.status(200).send(users)
}
    else {
        res.status(406).json("the users is not exist")
    }

})


app.put('/withDrawMoney', (req, res) => {
    let buffer = JSON.parse(fs.readFileSync('./bank.json').toString())
    const users = buffer.find(itm => itm.accountNumber === req.body.accountNumber);
    if (users) {
        if((users.money - parseFloat(req.body.amount)) >= 0 ){
        users.money -= parseFloat(req.body.amount);
        fs.writeFileSync('./bank.json', JSON.stringify(buffer))
        res.status(200).send(users)
}
res.status(406).json("up to the money limit")
}
    else {
        res.status(406).json("the users is not exist")
    }

})



app.put('/transfers', (req, res) => {
    let buffer = JSON.parse(fs.readFileSync('./bank.json').toString())
    const users = buffer.find(itm => itm.accountNumber === req.body.fromAccountNumber);
    const users2 = buffer.find(itm => itm.accountNumber === req.body.toAccountNumber);
    if (users && users2) {
        if((users.money - parseFloat(req.body.amount)) >= users.credit ){
        users.money -= parseFloat(req.body.amount);
        users2.money += parseFloat(req.body.amount);
        fs.writeFileSync('./bank.json', JSON.stringify(buffer))
        res.status(200).send(users)
    }
    res.status(406).json("not enough credit")
}
    else {
        res.status(406).json("One of the users does not exist")
    }

})



app.post('/', (req, res) => {
    let buffer = JSON.parse(fs.readFileSync('./bank.json').toString())
    if (buffer.find(itm => { return req.body.accountNumber === itm.accountNumber })) {
        return res.status(404).send('user exists')
    }
    const item = {
        name: req.body.name,
        email: req.body.email,
        credit: parseFloat(req.body.credit),
        money:  parseFloat(req.body.money),
        accountNumber: req.body.accountNumber,
        id: uniqid()
    }
    buffer = [...buffer, item]
    fs.writeFileSync('./bank.json', JSON.stringify(buffer))
    return res.status(201).json(item)
})





app.listen(5000, () => {
    console.log("listening on port 5000 ");
})
