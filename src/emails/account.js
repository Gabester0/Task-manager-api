const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_KEY);

const sendWelcomeEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'gceipper@gmail.com',
        subject: 'Thanks for signing up!',
        text: ` Welcome to the app, ${name}, let me know how you are enjoying the app.`
    })
}

const sendGoodbyeEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'gceipper@gmail.com',
        subject: `Goodbye friend`,
        text: `${name}, we are sorry to see you go.  Please know that you are welcome to return any time!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}