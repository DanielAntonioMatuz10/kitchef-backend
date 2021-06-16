import sendgrid from "@sendgrid/mail";

function getMessage(email, name, url) {
    return {
        to: email,
        from: 'isaacbezares@gmail.com',
        subject: 'Welcome to Kitchef!, Verify your email to activate your account',
        html: `Hello ${name} 
        <br><br><br>
        You are about to start your journey at Kitchef. You just need to verify your email.
        <br><br><br>
        To verify it, click <a href="${url}">here</a>`
    };
}

async function sendEmailConfirmation(email, name, url) {
    try {
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
        await sendgrid.send(getMessage(email, name, url));
        return {message: `confirmation email sent successfully`};
    } catch (error) {
        const message = `Error sending confirmation email`;
        console.error(message);
        console.error(error);
        if (error.response) {
            console.error(error.response.body)
        }
        return {message};
    }
}

export default sendEmailConfirmation;