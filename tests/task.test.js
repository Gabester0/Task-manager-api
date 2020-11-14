const request = require('supertest');
const app = require(`../src/app`);
const Task = require(`../src/models/tasks`);
const { 
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    taskFour,
    setupDb
} = require(`./fixtures/db`);

beforeEach(setupDb)

test(`Should create task for user`, async ()=>{
    const response = await request(app)
        .post('/tasks')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: `From my test`
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

// Should not create task with invalid description/completed
test(`Should not be able to create task with invalid values`, async ()=>{
    // No Description field
    await request(app)
        .post(`/tasks`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: false
        })
        .expect(400);
})

// Empty Description Field
test(`Should not be able to create task with empty description`, async ()=>{
    await request(app)
        .post(`/tasks`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: ``,
            completed: true
        })
        .expect(400);
})

// Completed is not a boolean
test(`Should not be able to create task with non-boolean completed`, async ()=>{
    await request(app)
        .post(`/tasks`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Task Test',
            completed: `later`
        })
        .expect(400);
});


test(`Should get only specific users tasks`, async ()=>{
    const response = await request(app)
        .get('/tasks')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})


// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks


// Should not update other users task
test(`Shouldn't update a different users tasks`, async()=>{
    const response = await request(app)
        .patch(`/tasks/${taskThree._id}`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: `I am task number three`
        })
        .expect(404)
})

// Should not update task with invalid description/completed
test(`Should not update task with invalid values`, async()=>{
    await request(app)
        .patch(`/tasks/${taskFour._id}`)
        .set(`Authorization`, `Bearer ${userTwo.tokens[0].token}`)
        .send({ completed: `Later` })
        .expect(400)
    const task = await Task.findById(taskFour._id)
    expect(task.completed).toEqual(false)
})


test(`User should not be able to delete another users tasks`, async ()=>{
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set(`Authorization`, `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(400)
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
})


// Should not delete task if unauthenticated
test(`Should not delete tasks if not logged in`, async()=>{
    await request(app)
        .delete(`/tasks/${taskThree._id}`)
        .send()
        .expect(401)
    const task = Task.findById(taskThree._id);
    expect(task).not.toBeNull();
})