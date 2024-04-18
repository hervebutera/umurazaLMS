import Mailgun from "mailgun-js";
import dotenv from "dotenv";
import postmark from "postmark"


dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;
const SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL;

const sendEmailMessage = (receiver_email, subject, message_text) => {

    // const DOMAIN = "";
    // const mg = Mailgun({apiKey: "p", domain: DOMAIN});
    // const data = {
    //     from: "Mailgun Sandbox <>",
    //     to: receiver_email,
    //     subject: subject,
    //     text: message_text,
    // };
    // mg.messages().send(data, function (error, body) {
    //     console.log(body, error.message, "yes");
    // });

    // You can see a record of this email in your logs: https://app.mailgun.com/app/logs.

    // You can send up to 300 emails/day from this sandbox server.
    // Next, you should add your own domain so you can send 10000 emails/month for free.

    var serverToken = "";
    var client = new postmark.ServerClient(serverToken);

    client.sendEmail({
        "From": "",
        "To": "",
        "Subject": subject,
        "TextBody": message_text
    });
}

export default sendEmailMessage;
