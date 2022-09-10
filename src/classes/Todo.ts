import { v4 as uuidv4 } from 'uuid';

export interface ITodo {
  id: string;
  title: string;
  description: string;
  priority: number;
  createdDate: string;
  isCompleted: boolean;
  dueDate: string;
  completedDate: string;
  project: string;
}

export interface IOptionalTodo {
  title: string;
  description: string;
  priority: number;
  dueDate: string;
}

export default class Todo implements ITodo {
  readonly id: string;
  createdDate: string;
  title: string;
  description: string;
  priority: number;
  isCompleted: boolean;
  dueDate: string;
  completedDate: string;
  project: string;

  constructor(
    title: string,
    description: string,
    priority: number,
    dueDate: string,
    project: string
  ) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
    this.project = project;
    this.createdDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ).toISOString();
    this.isCompleted = false;
    this.completedDate = '';
  }
}
