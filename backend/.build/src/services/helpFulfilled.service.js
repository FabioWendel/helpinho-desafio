"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpFulfilledService = void 0;
const aws_sdk_1 = require("aws-sdk");
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
const HELP_FULFILLED_TABLE = process.env.HELP_FULFILLED_TABLE;
if (!HELP_FULFILLED_TABLE) {
    throw new Error("HELP_FULFILLED_TABLE is not defined in the environment variables.");
}
exports.helpFulfilledService = {
    async createHelpFulfilled(helpFulfilled) {
        const params = {
            TableName: HELP_FULFILLED_TABLE,
            Item: helpFulfilled,
        };
        await dynamoDb.put(params).promise();
        return helpFulfilled;
    },
    async getAllHelpFulfilled() {
        const params = {
            TableName: HELP_FULFILLED_TABLE,
        };
        const result = await dynamoDb.scan(params).promise();
        return result.Items;
    },
    async getHelpFulfilledById(id) {
        const params = {
            TableName: HELP_FULFILLED_TABLE,
            Key: { id },
        };
        const result = await dynamoDb.get(params).promise();
        return result.Item;
    },
    async updateHelpFulfilled(id, updated) {
        if (Object.keys(updated).length === 0) {
            throw new Error("No fields provided for update");
        }
        const updateExpressionParts = [];
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};
        for (const [key, value] of Object.entries(updated)) {
            if (value !== undefined) {
                const attributeName = `#${key}`;
                const attributeValue = `:${key}`;
                updateExpressionParts.push(`${attributeName} = ${attributeValue}`);
                expressionAttributeValues[attributeValue] = value;
                expressionAttributeNames[attributeName] = key;
            }
        }
        const updateExpression = `SET ${updateExpressionParts.join(", ")}`;
        const params = {
            TableName: HELP_FULFILLED_TABLE,
            Key: { id },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames,
        };
        await dynamoDb.update(params).promise();
    },
    async deleteHelpFulfilled(id) {
        const params = {
            TableName: HELP_FULFILLED_TABLE,
            Key: { id },
        };
        await dynamoDb.delete(params).promise();
    },
};
