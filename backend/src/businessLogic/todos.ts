import { TodosAcess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
// import {parseUserId} from "../auth/utils";
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('TodosAcess')
const attachmentUtils = new AttachmentUtils()
const todosAcess = new TodosAcess()

//create gettodos function
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info('Get todos for user function called')
       return todosAcess.getAllTodos(userId)
}
// export async function getTodosForUser(jwtToken: string): Promise<TodoItem[]> {
//     const userId = parseUserId(jwtToken);
//     return todosAcess.getAllTodos(userId);
// }
//Create todo function

export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
   logger.info('Create todo function called')
    
   const todoId = uuid.v4()
   const createdAt = new Date().toISOString()
   const s3AttachmentUrl= attachmentUtils.getAttachmentUrl(todoId)
   const newItem ={
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUrl: s3AttachmentUrl,
    ...newTodo
   }

   return await todosAcess.createTodoItem(newItem)
}

//write update todo function
export async function updatedTodo(
    todoId: string,
    userId: string,
    todoUpdate: UpdateTodoRequest
): Promise<UpdateTodoRequest>{
    logger.info('Update todo function called')
    return await todosAcess.updateTodoItem(todoId, userId, todoUpdate)
}

//write delete todo
export async function deleteTodo(
    todoId: string,
    userId: string,
): Promise<string>{
    logger.info('Delete todo function called')
    return todosAcess.deleteTodoItem(todoId, userId)
}


//update url
export async function createAttachmentPresignedUrl(
    todoId: string,
    userid: string

): Promise<string>{
    logger.info(' Create attachment funstion called by user', userid, todoId)
    return attachmentUtils.getUploadUrl(todoId)

}