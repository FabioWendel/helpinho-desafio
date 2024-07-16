import { DynamoDB } from "aws-sdk";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { HelpCreate, HelpUpdate } from "../models/help.model";
import { UserCreate } from "../models/user.model";

const dynamoDb = new DynamoDB.DocumentClient();
const HELP_TABLE = process.env.HELP_TABLE;
const USER_TABLE = process.env.USER_TABLE;

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const s3 = new S3Client({ region: process.env.AWS_REGION_LOCALE });

if (!HELP_TABLE || !BUCKET_NAME || !USER_TABLE) {
  throw new Error(
    "HELP_TABLE or BUCKET_NAME or USER_TABLEis not defined in the environment variables."
  );
}

export const helpService = {
  async getAllHelps(): Promise<HelpCreate[]> {
    const params = {
      TableName: HELP_TABLE,
    };
    const result = await dynamoDb.scan(params).promise();
    const helps = result.Items as HelpCreate[];

    const helpsWithUserDetails = await Promise.all(
      helps.map(async (help) => {
        const userParams = {
          TableName: USER_TABLE,
          Key: {
            id: help.requesterId,
          },
        };
        const userResult = await dynamoDb.get(userParams).promise();
        const user = userResult.Item as UserCreate;

        return {
          ...help,
          requesterDetails: user,
        };
      })
    );

    return helpsWithUserDetails;
  },

  async getHelpById(id: string): Promise<HelpCreate | null> {
    const params = {
      TableName: HELP_TABLE,
      Key: { id },
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item as HelpCreate | null;
  },

  async getMyHelpers(id: string): Promise<HelpCreate[]> {
    const params = {
      TableName: HELP_TABLE,
      IndexName: "requesterId-index",
      KeyConditionExpression: "requesterId = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    };
    const result = await dynamoDb.query(params).promise();
    return result.Items as HelpCreate[];
  },

  async createHelp(helpRequest: HelpCreate): Promise<HelpCreate> {
    const params = {
      TableName: HELP_TABLE,
      Item: helpRequest,
    };

    await dynamoDb.put(params).promise();
    return helpRequest;
  },

  async updateHelp(id: string, updated: Partial<HelpUpdate>): Promise<void> {
    if (Object.keys(updated).length === 0) {
      throw new Error("No fields provided for update");
    }

    const currentItem = await dynamoDb
      .get({ TableName: HELP_TABLE, Key: { id } })
      .promise();
    const currentImageUrl = currentItem.Item?.image as string;

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
      TableName: HELP_TABLE,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
    };

    if (updated.image && currentImageUrl) {
      const oldImageKey = getKeyFromUrl(currentImageUrl);
      if (oldImageKey) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: oldImageKey,
          })
        );
      }
    }

    await dynamoDb.update(params).promise();
  },

  async deleteHelpRequest(id: string): Promise<void> {
    const params = {
      TableName: HELP_TABLE,
      Key: { id },
    };
    await dynamoDb.delete(params).promise();
  },

  async getImageUrl(): Promise<string[]> {
    const params = {
      TableName: HELP_TABLE,
      ProjectionExpression: "image",
    };

    const result = await dynamoDb.scan(params).promise();
    return result.Items?.map((item) => item.image) || [];
  },
};

const getKeyFromUrl = (url: string): string | null => {
  const matches = url.match(/\/([^/]+)$/);
  return matches ? matches[1] : null;
};
