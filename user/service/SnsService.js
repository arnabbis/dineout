import dotenv from "dotenv";
import {SNSClient,PublishCommand} from "@aws-sdk/client-sns";
dotenv.config();

const snsConfig = new SNSClient({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
    }
});

export const sendDeactiveUserMail = async(user) =>{
        const message = `
Hello ${user.name}! 👋

Welcome! You have successfully registered.

Your details:
- Name  : ${user.name}
- Email : ${user.email}
- Phone : ${user.phone}
- City  : ${user.city}

We are glad to have you onboard! 🎉

— The Team
    `;

    await snsConfig.send(new PublishCommand({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Subject:  `Welcome ${user.name}! 🎉`,
        Message:  message,
    }));
        console.log(`✅ Welcome email sent to ${user.email}`);
}

export const sendWelcomeMail = async(user) =>{
        const message = `
Hello ${user.name}! 👋

Welcome! You have successfully registered.

Your details:
- Name  : ${user.name}
- Email : ${user.email}
- Phone : ${user.phone}
- City  : ${user.city}

We are glad to have you onboard! 🎉

— The Team
    `;

    await snsConfig.send(new PublishCommand({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Subject:  `Welcome ${user.name}! 🎉`,
        Message:  message,
    }));
        console.log(`✅ Welcome email sent to ${user.email}`);
}