import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// The SES client will automatically use AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION from env
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export const sendEmail = async (to: string, subject: string, body: string) => {
  if (!process.env.AWS_SES_FROM_EMAIL) {
    console.warn("AWS_SES_FROM_EMAIL is not defined. Skipping email sending.");
    return false;
  }

  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: process.env.AWS_SES_FROM_EMAIL,
  };

  try {
    const command = new SendEmailCommand(params);
    const data = await sesClient.send(command);
    console.log("Email sent successfully:", data.MessageId);
    return true;
  } catch (error) {
    console.error("Failed to send email via SES:", error);
    return false;
  }
};
