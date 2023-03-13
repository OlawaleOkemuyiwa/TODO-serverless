import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

//create todo func
export const createTodo = async (
  newTodo: CreateTodoRequest,
  userId: string
): Promise<TodoItem> => {
  logger.info('Create todo function in action')

  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
  const newItem = {
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUrl: s3AttachmentUrl,
    ...newTodo
  }

  return await todosAccess.createTodoItem(newItem)
}

//read todos func
export const getTodosForUser = async (userId: string) => {
  logger.info(`Getting todo items for user: ${userId}...`)

  const todoItems = await todosAccess.getAllTodos(userId)

  return todoItems
}

//update todo func
export const updateTodo = async (
  todoId: string,
  userId: string,
  todoUpdate: UpdateTodoRequest
) => {
  logger.info('Todo update in progress...')
  await todosAccess.updateTodoItem(todoId, userId, todoUpdate)
}

//delete todo func
export const deleteTodo = async (todoId: string, userId: string) => {
  logger.info('Todo item about to be deleted...')
  await todosAccess.deleteTodoItem(todoId, userId)
}

//create presigned URL
export const createAttachmentPresignedUrl = async (
  userId: string,
  todoId: string
): Promise<string> => {
  logger.info('Creating an attachment presigned URL for user', userId, todoId)
  return attachmentUtils.getUploadUrl(todoId)
}
