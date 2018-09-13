require("../configs/configuration")
const express = require('express')
var mongoose = require('mongoose');
const request = require('supertest')
const router = require('../server/router')

describe('API', () => {
    let app

    before(() => {
        app = express()
        router(app, express.Router())
    })

    after(() => {
        mongoose.connection.close()
    })

    it('buyLimit', () => {
        request(app)
            .get('/trade/project/5b973408f62f5301e2318973/buyLimit?symbol=ADABTC&price=0.0000101&quantity=100&clientOrderId=11111')
            .expect((res) => {
                console.log(res.text)
            })
            .end()
    })
})
