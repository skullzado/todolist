import { format } from 'date-fns';
import Project, { IProject } from './classes/Project';
import Todo from './classes/Todo';

const projectListData = [
  new Project('Work', [
    new Todo(
      'Test 1',
      'Test description 1',
      1,
      format(new Date(), 'yyyy-MM-dd'),
      'Work'
    ),
  ]),
  new Project('Personal', []),
  new Project('General', []),
  new Project('Completed', []),
];

export const setData = (data: IProject[]) => {
  if (localStorage.getItem('todos')) {
    localStorage.clear();
  }
  localStorage.setItem('todos', JSON.stringify(data));
};

setData(projectListData);

export const convertedData = () => {
  const localData = JSON.parse(localStorage.getItem('todos') || '');
  if (!localData) return projectListData;
  return localData.map(
    (project: IProject) => new Project(project.title, project.todos)
  );
};
