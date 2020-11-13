const request = require(`supertest`);
const app = require(`../src/app`);
const User = require(`../src/models/user`);
const { set } = require(`../src/app`);
const { userOne, userOneId, setupDb } = require(`./fixtures/db`);

beforeEach(setupDb)

test(`Should signup a new user`, async()=>{
    const response = await request(app).post(`/users`).send({
        name: `TestGabe`,
        email: `jesterGabe@test.com`,
        password: `MyPass777!@`
    }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: `TestGabe`,
            email: `jestergabe@test.com`
        },
        token: user.tokens[0].token
    })
    // Expect Password to not be stored in plain text
    expect(user.password).not.toBe(`MyPass777!@`)
})

test(`Should not sign up new user with invalid name`, async ()=>{
    await request(app)
        .post('/users')
        .send({
            email: `jesterGabe@test.com`,
            password: `MyPass777!@`
        })
        .send()
        .expect(400)
})

test(`Should not sign up new user with invalid email || password`, async ()=>{
    //Missing `@`
    await request(app)
        .post('/users')
        .send({
            name: `TestGabe`,
            email: `jesterGabe.com`,
            password: `MyPass777!@`
        })
        .send()
        .expect(400)
    // Missing email field
    await request(app)
        .post('/users')
        .send({
            name: `TestGabe`,
            password: `MyPass777!@`
        })
        .send()
        .expect(400)
    // Missing `.com`
    await request(app)
        .post('/users')
        .send({
            name: `TestGabe`,
            email: `jesterGabe@gmail`,
            password: `MyPass777!@`
        })
        .send()
        .expect(400)
})

test(`Should not sign up new user with invalid password`, async ()=>{
    // No password
    await request(app)
        .post('/users')
        .send({
            name: `TestGabe`,
            email: `jesterGabe@test.com`
        })
        .expect(400)
    // Short password
    await request(app)
        .post('/users')
        .send({
            name: `TestGabe`,
            email: `jesterGabe@test.com`,
            password: `MyPass`
        })
        .expect(400)
    // Password contains the word `password`
    await request(app)
        .post('/users')
        .send({
            name: `TestGabe`,
            email: `jesterGabe@test.com`,
            password: `Mypassword`
        })
        .expect(400)
})


test(`Should login existing user`, async()=>{
    const response = await request(app).post(`/users/login`).send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token)
})

test(`Login should fail if nonexisting user attempts login`, async()=>{
    await request(app).post(`/users/login`).send({
        email: `fake@fake.com`,
        password: `fakkkerr4#`
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

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
})

// Should not delete user if unauthenticated
test(`Should not delete account for unauthenticated user`, async()=>{
    await request(app)
        .delete(`/users/me`)
        .send()
        .expect(401)
})

test(`Should upload avatar image`, async()=>{
    await request(app)
        .post(`/users/me/avatar`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .attach(`avatar`, `tests/fixtures/profile-pic.jpg`)
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))  
})


test(`Should update valid user fields`, async()=>{
    await request(app)
        .patch(`/users/me`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({ "name": "Gabe" })
        .expect(200)
        const user = await User.findById(userOneId)
        expect(user.name).toEqual(`Gabe`)
    })
    
test(`Should not update invalid user fields`, async()=>{
    await request(app)
    .patch(`/users/me`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send({"location": "Bora Bora"})
    expect(400)
})

// Should not update user with invalid name/email/password
test(`Should not update user with invalid values`, async()=>{
    // No Name
        await request(app)
        .patch(`/users/me`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: ``
        })
        .expect(400)
    // No Password
    await request(app)
        .patch(`/users/me`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: null
        })
        .expect(400)
    // Password too short
    await request(app)
        .patch(`/users/me`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: `MyPass`
        })
        .expect(400)
    // Password contains the word `password`
    await request(app)
        .patch(`/users/me`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: `Mypassword`
        })
        .expect(400)
    // No Email
    await request(app)
        .patch(`/users/me`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: ``
        })
        .expect(400)
    // Email does not contain `.com`
    await request(app)
        .patch(`/users/me`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: `newEmail@mail`
        })
        .expect(400)
    // Email does not contain `@`
    await request(app)
        .patch(`/users/me`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: `newEmail.gmail.com`
        })
        .expect(400)
})

// Should not update user if unauthenticated
test(`Should not update user fields for unauthenticated user`, async()=>{
    await request(app)
    .patch(`/users/me`)
    .send({"location": "Bora Bora"})
    expect(400)
})