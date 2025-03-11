exports.handler = async (event) => {
    try {
        // Loop through each record in the event
        for (const record of event.Records) {
            // Log the message body to CloudWatch Logs
            console.log("Received SQS message:", record.body);
        }

        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "SQS messages processed successfully" }),
        };
    } catch (error) {
        // Log the error to CloudWatch Logs
        console.error("Error processing SQS messages:", error);

        // Return error response
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error processing SQS messages" }),
        };
    }
};