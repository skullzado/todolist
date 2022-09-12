import { IOptionalTodo, ITodo } from './Todo';

export interface IProject {
  title: string;
  todos: ITodo[];
  addTodo(todo: ITodo): void;
  deleteTodo(id: string): void;
  updateTodo(id: string, newTodo: IOptionalTodo): void;
  completeTodo(id: string): void;
}

export default class Project implements IProject {
  title: string;
  todos: ITodo[];

  constructor(title: string, todos: ITodo[]) {
    this.title = title;
    this.todos = todos;
  }

  addTodo(todo: ITodo) {
    this.todos.push(todo);
  }

  deleteTodo(id: string) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  updateTodo(id: string, newTodo: IOptionalTodo) {
    this.todos.map((todo) => {
      if (todo.id === id) {
        return Object.assign(todo, newTodo);
      }
      return todo;
    });
  }

  completeTodo(id: string) {
    this.todos.map((todo) => {
      if (todo.id === id) {
        todo.isCompleted = !todo.isCompleted;
        todo.completedDate = new Date().toISOString();
        return todo;
      }
      return todo;
    });
  }
}
