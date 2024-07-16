import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { UserCreate, UserUpdate } from "../models/user.model";

const dynamoDb = new DynamoDB.DocumentClient();
const USER_TABLE = process.env.USER_TABLE;

if (!USER_TABLE) {
  throw new Error("USER_TABLE is not defined in the environment variables.");
}

export const userService = {
  async getAllUsers(): Promise<UserCreate[]> {
    const params = {
      TableName: USER_TABLE,
    };
    const result = await dynamoDb.scan(params).promise();
    return result.Items as UserCreate[];
  },

  async getUserById(id: string): Promise<UserCreate | null> {
    const params = {
      TableName: USER_TABLE,
      Key: { id },
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item as UserCreate | null;
  },

  async getUserByEmail(email: string): Promise<UserUpdate | null> {
    const params = {
      TableName: USER_TABLE,
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };
    const result = await dynamoDb.query(params).promise();
    return result.Items ? (result.Items[0] as UserUpdate) : null;
  },

  async createUser(user: UserCreate): Promise<UserCreate> {
    const existingUser = await userService.getUserByEmail(user.email);

    if (existingUser) {
      throw new Error("Email already exists");
    }

    user.id = uuidv4();
    user.password = await bcrypt.hash(user.password, 10);
    const params = {
      TableName: USER_TABLE,
      Item: user,
    };
    await dynamoDb.put(params).promise();
    return user;
  },

  async updateUser(
    id: string,
    updatedUser: Partial<UserUpdate>
  ): Promise<void> {
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

  async deleteUser(id: string): Promise<void> {
    const params = {
      TableName: USER_TABLE,
      Key: { id },
    };
    await dynamoDb.delete(params).promise();
  },

  async authenticateUser(
    email: string,
    password: string
  ): Promise<UserUpdate | null> {
    const user = await this.getUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  },
};
