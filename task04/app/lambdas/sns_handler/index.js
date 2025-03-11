exports.handler = async (event) => {
    try {
        // Loop through each record in the SNS event
        for (const record of event.Records) {
            const snsMessage = record.Sns.Message; // Extract the SNS message
            console.log("Received SNS message:", snsMessage);
        }

        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "SNS messages processed successfully" }),
        };
    } catch (error) {
        console.error("Error processing SNS messages:", error);

        // Return error response
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error processing SNS messages" }),
        };
    }
};