"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const aws_sdk_1 = require("aws-sdk");
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
const USER_TABLE = process.env.USER_TABLE;
if (!USER_TABLE) {
    throw new Error("USER_TABLE is not defined in the environment variables.");
}
exports.userService = {
    async getAllUsers() {
        const params = {
            TableName: USER_TABLE,
        };
        const result = await dynamoDb.scan(params).promise();
        return result.Items;
    },
    async getUserById(id) {
        const params = {
            TableName: USER_TABLE,
            Key: { id },
        };
        const result = await dynamoDb.get(params).promise();
        return result.Item;
    },
    async getUserByEmail(email) {
        const params = {
            TableName: USER_TABLE,
            IndexName: "EmailIndex",
            KeyConditionExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email,
            },
        };
        const result = await dynamoDb.query(params).promise();
        return result.Items ? result.Items[0] : null;
    },
    async createUser(user) {
        const existingUser = await exports.userService.getUserByEmail(user.email);
        if (existingUser) {
            throw new Error("Email already exists");
        }
        user.id = (0, uuid_1.v4)();
        user.password = await bcryptjs_1.default.hash(user.password, 10);
        const params = {
            TableName: USER_TABLE,
            Item: user,
        };
        await dynamoDb.put(params).promise();
        return user;
    },
    async updateUser(id, updatedUser) {
        const params = {
            TableName: USER_TABLE,
            Key: { id },
            UpdateExpression: "set #name = :name, phone = :phone, email = :email",
            ExpressionAttributeNames: {
                "#name": "name",
            },
            ExpressionAttributeValues: {
                ":name": updatedUser.name,
                ":phone": updatedUser.phone,
                ":email": updatedUser.email,
            },
        };
        await dynamoDb.update(params).promise();
    },
    async deleteUser(id) {
        const params = {
            TableName: USER_TABLE,
            Key: { id },
        };
        await dynamoDb.delete(params).promise();
    },
    async authenticateUser(email, password) {
        const user = await this.getUserByEmail(email);
        if (user && (await bcryptjs_1.default.compare(password, user.password))) {
            return user;
        }
        return null;
    },
};
