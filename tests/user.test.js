const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');
const { set } = require('../src/app');

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
    _id: userOneId,
    name: "Mike",
    email: "mike@example.com",
    password: "Wh@tttt!9",
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

beforeEach( async ()=>{
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should signup a new user', async()=>{
    await request(app).post('/users').send({
        name: 'TestGabe',
        email: 'jesterGabe@test.com',
        password: 'MyPass777!@'
    }).expect(201)
})

test('Should login existing user', async()=>{
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Login should fail if nonexisting user attempts login', async()=>{
    await request(app).post('/users/login').send({
        email: 'fake@fake.com',
        password: 'fakkkerr4#'
    }).expect(400)
})

test(`Should get users profile`, async()=>{
    await request(app)
        .get(`/users/me`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test(`Should not get profile for unauthenticated user`, async()=>{
    await request(app)
        .get(`/users/me`)
        .send()
        .expect(401) 
})

test(`Should delete account for authenticated user`, async ()=>{
    await request(app)
        .delete(`/users/me`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test(`Should not delete account for unauthenticated user`, async()=>{
    await request(app)
        .delete(`/users/me`)
        .send()
        .expect(401)
})