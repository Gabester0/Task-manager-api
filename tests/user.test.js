const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const userOne = {
    name: "Mike",
    email: "mike@example.com",
    password: "Wh@tttt!9"
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