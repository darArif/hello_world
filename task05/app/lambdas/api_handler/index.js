const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.target_table;  // AWS-Syndicate injected alias

exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);

        const { principalId, content } = requestBody;

        if (typeof principalId !== 'number' || typeof content !== 'object') {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid request format' })
            };
        }

        const createdEvent = {
            id: uuidv4(),
            principalId,
            createdAt: new Date().toISOString(),
            body: content
        };

        await saveEventToDynamoDB(createdEvent);

        return {
            statusCode: 201,
            body: JSON.stringify({
                statusCode: 201,
                event: createdEvent
            })
        };
    } catch (error) {
        console.error('Error handling event:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        };
    }
};

async function saveEventToDynamoDB(event) {
    const params = {
        TableName: TABLE_NAME,
        Item: event
    };

    await dynamoDb.put(params).promise();
}