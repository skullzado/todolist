import { ITodo } from './Todo';
import { v4 as uuidv4 } from 'uuid';

export interface IProject {
  id: string;
  title: string;
  todos: ITodo[];
  taskNumber: number;
  addTodo(todo: ITodo): void;
  deleteTodo(id: string): ITodo[];
  updateTodo(id: string, newTodo: ITodo): ITodo[];
}

export default class Project implements IProject {
  readonly id: string;
  title: string;
  todos: ITodo[];
  taskNumber: number;

  constructor(title: string, todos: ITodo[]) {
    this.id = uuidv4();
    this.title = title;
    this.todos = todos;
    this.taskNumber = this.todos.length;
  }

  addTodo(todo: ITodo) {
    this.todos.push(todo);
    this.taskNumber = this.todos.length;
  }

  deleteTodo(id: string) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.taskNumber = this.todos.length;
    return this.todos;
  }

  updateTodo(id: string, newTodo: ITodo) {
    return this.todos.map((todo) => {
      if (todo.id === id) {
        todo = Object.assign(todo, newTodo);
        return todo;
      }
      return todo;
    });
  }
}
