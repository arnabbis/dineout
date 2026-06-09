import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import dotenv from "dotenv";
import {sendWelcomeMail} from "./SnsService.js";
import { json } from "express";
dotenv.config();

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Producer where we send message 
export const push_To_Queue = async(user)=>{
    try{
        await sqsClient.send(new SendMessageCommand({
            QueueUrl: process.env.SQS_QUEUE_URL,
            MessageBody:JSON.stringify({eventType:"USER_REGISTERED",user,timestamp: new Date().toISOString()})
        }));
        console.log("✅ Message pushed to SQS!");
    }catch(err){
        console.log("Error: ",err.message);
        throw err;
    }
}


// Consumer which consumes the message from the queue and process  
export const process_Queue = async()=>{
    console.log("👂 Listening to SQS queue...");
    while(true){
        try{
            const response = await sqsClient.send(new ReceiveMessageCommand({
                QueueUrl: process.env.SQS_QUEUE_URL,
                MaxNumberOfMessages: 1,
                WaitTimeSeconds:     20,
                AttributeNames:      ["ApproximateReceiveCount"]
            }));

            if(response.Messages && response.Messages.length>0){
                const message = response.Messages[0];
                console.log("message....{}",message)
                const body         = JSON.parse(message.Body);
                const attemptCount = message.Attributes.ApproximateReceiveCount;
                try{
                    await send_userRegistration_message(body);
                    await deleteMessage(message.ReceiptHandle);
                    console.log("✅ Message processed and deleted!");
                }catch(err){
                    console.error(`❌ Attempt #${attemptCount} failed:`, err.message);
                    console.log("⏳ Message will reappear and retry automatically...");
                    if (attemptCount >=5) {
                        console.log("📬 Max attempts reached → moving to DLQ!");
                    }
                }
            }
        }catch(err){
            console.error("❌ Queue error:", err.message);
            await new Promise(resolve=> setTimeout(resolve,5000));
        }
    }
    
}

const send_userRegistration_message = async(body)=>{
    try{
        await sendWelcomeMail(body.user);
    }catch(err){
        console.log("Error while Sending Message From Sns: ",err.message);
        throw err;
    }
}

const deleteMessage = async (receiptHandle) => {
    await sqsClient.send(new DeleteMessageCommand({
        QueueUrl:      process.env.SQS_QUEUE_URL,
        ReceiptHandle: receiptHandle,
    }));
};