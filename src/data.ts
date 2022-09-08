import Project, { IProject } from './classes/Project';
import Todo from './classes/Todo';

export const ProjectList: IProject[] = [
  new Project('Work', [
    new Todo(
      'Learn TypeScript',
      'Learn it now or else!',
      4,
      new Date('12-01-2022').toISOString()
    ),
    new Todo(
      'Learn React',
      'Learn it now or else!',
      3,
      new Date('12-01-2022').toISOString()
    ),
  ]),
  new Project('Personal', []),
  new Project('General', []),
  new Project('Completed', []),
];
