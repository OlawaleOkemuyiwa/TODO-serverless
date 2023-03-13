import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
var AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosIndex = process.env.INDEX_NAME
  ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all todo items...')

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.todosIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    return result.Items as TodoItem[]
  }

  async createTodoItem(todo: TodoItem): Promise<TodoItem> {
    logger.info('Creating todo item...')

    const createdTodo = await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todo
      })
      .promise()

    logger.info('Todo item created', createdTodo)

    return todo as TodoItem
  }

  async updateTodoItem(
    todoId: string,
    userId: string,
    todoUpdate: TodoUpdate
  ): Promise<TodoUpdate> {
    logger.info('Updating todo item...')

    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
          ':name': todoUpdate.name,
          ':dueDate': todoUpdate.dueDate,
          ':done': todoUpdate.done
        },
        ExpressionAttributeNames: {
          '#name': 'name'
        }
      })
      .promise()
    return todoUpdate
  }

  async deleteTodoItem(todoId: string, userId: string): Promise<void> {
    logger.info('Deleting a todo item ...')

    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        }
      })
      .promise()
  }

  async updateTodoAttachmentUrl(
    todoId: string,
    userId: string,
    attachmentUrl: string
  ): Promise<void> {
    logger.info('Updating a todo attachment url...')

    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachment': attachmentUrl
        }
      })
      .promise()
  }
}