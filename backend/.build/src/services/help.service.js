"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpService = void 0;
const aws_sdk_1 = require("aws-sdk");
const client_s3_1 = require("@aws-sdk/client-s3");
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
const HELP_TABLE = process.env.HELP_TABLE;
const USER_TABLE = process.env.USER_TABLE;
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const s3 = new client_s3_1.S3Client({ region: process.env.AWS_REGION_LOCALE });
if (!HELP_TABLE || !BUCKET_NAME || !USER_TABLE) {
    throw new Error("HELP_TABLE or BUCKET_NAME or USER_TABLEis not defined in the environment variables.");
}
exports.helpService = {
    async getAllHelps() {
        const params = {
            TableName: HELP_TABLE,
        };
        const result = await dynamoDb.scan(params).promise();
        const helps = result.Items;
        const helpsWithUserDetails = await Promise.all(helps.map(async (help) => {
            const userParams = {
                TableName: USER_TABLE,
                Key: {
                    id: help.requesterId,
                },
            };
            const userResult = await dynamoDb.get(userParams).promise();
            const user = userResult.Item;
            return {
                ...help,
                requesterDetails: user,
            };
        }));
        return helpsWithUserDetails;
    },
    async getHelpById(id) {
        const params = {
            TableName: HELP_TABLE,
            Key: { id },
        };
        const result = await dynamoDb.get(params).promise();
        return result.Item;
    },
    async getMyHelpers(id) {
        const params = {
            TableName: HELP_TABLE,
            IndexName: "requesterId-index",
            KeyConditionExpression: "requesterId = :id",
            ExpressionAttributeValues: {
                ":id": id,
            },
        };
        const result = await dynamoDb.query(params).promise();
        return result.Items;
    },
    async createHelp(helpRequest) {
        const params = {
            TableName: HELP_TABLE,
            Item: helpRequest,
        };
        await dynamoDb.put(params).promise();
        return helpRequest;
    },
    async updateHelp(id, updated) {
        if (Object.keys(updated).length === 0) {
            throw new Error("No fields provided for update");
        }
        const currentItem = await dynamoDb
            .get({ TableName: HELP_TABLE, Key: { id } })
            .promise();
        const currentImageUrl = currentItem.Item?.image;
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
            TableName: HELP_TABLE,
            Key: { id },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames,
        };
        if (updated.image && currentImageUrl) {
            const oldImageKey = getKeyFromUrl(currentImageUrl);
            if (oldImageKey) {
                await s3.send(new client_s3_1.DeleteObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: oldImageKey,
                }));
            }
        }
        await dynamoDb.update(params).promise();
    },
    async deleteHelpRequest(id) {
        const params = {
            TableName: HELP_TABLE,
            Key: { id },
        };
        await dynamoDb.delete(params).promise();
    },
    async getImageUrl() {
        const params = {
            TableName: HELP_TABLE,
            ProjectionExpression: "image",
        };
        const result = await dynamoDb.scan(params).promise();
        return result.Items?.map((item) => item.image) || [];
    },
};
const getKeyFromUrl = (url) => {
    const matches = url.match(/\/([^/]+)$/);
    return matches ? matches[1] : null;
};
