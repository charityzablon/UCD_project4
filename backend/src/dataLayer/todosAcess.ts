import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';

var AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAcess{
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.INDEX_NAME
    )
    {}
    async getAllTodos(userId: string): Promise <TodoItem[]> {
        logger.info('Get all todos function called')

        const result = await this.docClient
        .query({
            TableName: this.todoTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })
        .promise()
        const items = result.Items
        return items as TodoItem[]

    }
    async createTodoItem(todoItem: TodoItem): Promise<TodoItem>{
        logger.info('Create todo item function called')

        const result =await this.docClient
        .put({
            TableName: this.todoTable,
            Item: todoItem
        })

    .promise()
    logger.info('Todo item created', result)

    return todoItem as TodoItem
    }

    async updateTodoItem(
        userId: string,
        todoId: string,
        todoUpdate: TodoUpdate
    ): Promise<TodoUpdate> {
        logger.info('Update todo function called')

        await this.docClient

        .update({
            TableName: this.todoTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done
            }

        })

        .promise()
        
        return todoUpdate as TodoUpdate
    }

    async  deleteTodoItem(todoId: string, userId: string): Promise<string> {
        logger.info('Delete todo item function called')
            const result = await this.docClient
        .delete({
            TableName: this.todoTable,
            Key: {
                todoId,
                userId
            }
        })
        .promise()
        logger.info('Todo item delete', result)            

        return todoId as string
        
    }
   
}
