import { DynamoDB } from "aws-sdk";
import {
  HelpFulfilledCreate,
  HelpFulfilledUpdate,
} from "../models/HelpFulfilled.model";

const dynamoDb = new DynamoDB.DocumentClient();
const HELP_FULFILLED_TABLE = process.env.HELP_FULFILLED_TABLE;

if (!HELP_FULFILLED_TABLE) {
  throw new Error(
    "HELP_FULFILLED_TABLE is not defined in the environment variables."
  );
}

export const helpFulfilledService = {
  async createHelpFulfilled(
    helpFulfilled: HelpFulfilledCreate
  ): Promise<HelpFulfilledCreate> {
    const params = {
      TableName: HELP_FULFILLED_TABLE,
      Item: helpFulfilled,
    };
    await dynamoDb.put(params).promise();
    return helpFulfilled;
  },

  async getAllHelpFulfilled(): Promise<HelpFulfilledCreate[]> {
    const params = {
      TableName: HELP_FULFILLED_TABLE,
    };

    const result = await dynamoDb.scan(params).promise();
    return result.Items as HelpFulfilledCreate[];
  },

  async getHelpFulfilledById(id: string): Promise<HelpFulfilledCreate | null> {
    const params = {
      TableName: HELP_FULFILLED_TABLE,
      Key: { id },
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item as HelpFulfilledCreate | null;
  },

  async updateHelpFulfilled(
    id: string,
    updated: Partial<HelpFulfilledUpdate>
  ): Promise<void> {
    if (Object.keys(updated).length === 0) {
      throw new Error("No fields provided for update");
    }

    const updateExpressionParts: string[] = [];
    const expressionAttributeValues: { [key: string]: any } = {};
    const expressionAttributeNames: { [key: string]: string } = {};

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

  async deleteHelpFulfilled(id: string): Promise<void> {
    const params = {
      TableName: HELP_FULFILLED_TABLE,
      Key: { id },
    };
    await dynamoDb.delete(params).promise();
  },
};
