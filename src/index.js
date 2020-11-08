const express = require('express');
const app = express();
const cors = require('cors');
require('./db/mongoose');
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');

app.use(express.json());
app.use(userRouter)
app.use(taskRouter)

app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Server is listening on localhost:${process.env.PORT || 3000 }`)
})