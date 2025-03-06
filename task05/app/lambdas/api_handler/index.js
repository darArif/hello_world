const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const EVENTS_TABLE = process.env.TARGET_TABLE; // AWS Syndicate alias passed via env var

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);

        const newEvent = {
            id: uuidv4(),
            principalId: body.principalId,
            createdAt: new Date().toISOString(),
            body: body.content
        };

        const params = {
            TableName: EVENTS_TABLE,
            Item: newEvent
        };

        await dynamoDb.put(params).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({
                statusCode: 201,
                event: newEvent
            }),
            headers: {
                "Content-Type": "application/json"
            }
        };
    } catch (error) {
        console.error("Error processing request:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
            headers: {
                "Content-Type": "application/json"
            }
        };
    }
};
