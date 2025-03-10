import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const dynamoDBClient = new DynamoDBClient();
const TABLE_NAME = process.env.TABLE_NAME || "Events";

export const handler = async (event) => {
    try {
        console.log("Received event:", JSON.stringify(event, null, 2));

        let inputEvent;
        try {
            inputEvent = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        } catch (parseError) {
            console.error("Error parsing event body:", parseError);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid JSON format in request body" })
            };
        }

        if (!inputEvent?.principalId || inputEvent?.content === undefined) {
            console.error("Validation failed: Missing required fields", inputEvent);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid input: principalId and content are required" })
            };
        }

        const eventId = uuidv4();
        const createdAt = new Date().toISOString();

        // Ensure body is a JSON object
        let bodyContent;
        if (typeof inputEvent.content === 'string') {
            try {
                // Try to parse it if it's a JSON string
                bodyContent = JSON.parse(inputEvent.content);
            } catch (e) {
                // If it's not valid JSON, create an object with the content
                bodyContent = { "value": inputEvent.content };
            }
        } else if (typeof inputEvent.content === 'object') {
            // If it's already an object, use it directly
            bodyContent = inputEvent.content;
        } else {
            // For other data types, create an object with the content
            bodyContent = { "value": inputEvent.content };
        }

        const eventItem = {
            id: eventId,
            principalId: Number(inputEvent.principalId),
            createdAt,
            body: bodyContent
        };

        console.log("Saving to DynamoDB:", JSON.stringify(eventItem, null, 2));

        const response = await dynamoDBClient.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: eventItem,
        }));
        console.log("Saved successfully");

        console.log("DynamoDB Response:", response);

        // Return only the top-level statusCode, don't nest it in the body
        return {
            statusCode: 201,
            body: JSON.stringify({ event: eventItem })
        };

    } catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error", error: error.message })
        };
    }
};