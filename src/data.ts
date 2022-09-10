import Project, { IProject } from './classes/Project';
import Todo from './classes/Todo';

export const ProjectList: IProject[] = [
  new Project('Work', []),
  new Project('Personal', []),
  new Project('General', []),
  new Project('Completed', []),
];
