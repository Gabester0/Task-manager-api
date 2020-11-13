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
        expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)

})

test(`Should get only specific users tasks`, async()=>{
    const response = await request(app)
        .get('/tasks')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test(`User should not be able to delete another users tasks`, async()=>{
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set(`Authorization`, `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(400)
        const task = await Task.findById(taskOne._id);
        expect(task).not.toBeNull();
    })
    
// Should not create task with invalid description/completed
test(`Should not be able to create task with invalid values`, async()=>{
    // No Description field
    const noDescription = delete taskOne.description
    await request(app)
        .post(`/tasks`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({ ...noDescription})
        .expect(400)
    // Empty Description Field
    const emptyDescription = taskOne;
    emptyDescription.description = ``
    await request(app)
        .post(`/tasks`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({ ...emptyDescription})
        .expect(400)
    // Completed is not a boolean
    const invalidCompleted = taskOne;
    invalidCompleted.completed = `false`
    await request(app)
        .post(`/tasks`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({ ...invalidCompleted})
        .expect(400)
})
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks