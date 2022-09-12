import formatDistance from 'date-fns/formatDistance';
import format from 'date-fns/format';
import LogoIconSrc from '../assets/logo-icon.png';
import { ITodo } from './Todo';
import { IProject } from './Project';

type PriorityLevelType = {
  [key: string]: {
    [key: string]: string;
  };
};

const PriorityLevel: PriorityLevelType = {
  1: {
    level: 'Non-Priority',
    color: 'gray',
  },
  2: {
    level: 'Low',
    color: 'green',
  },
  3: {
    level: 'Medium',
    color: 'orange',
  },
  4: {
    level: 'High',
    color: 'red',
  },
};

export default class UI {
  static renderLayout() {
    let app;
    if (document.querySelector('.app')) {
      app = document.querySelector('.app') as HTMLDivElement;
    } else {
      app = document.createElement('div') as HTMLDivElement;
    }
    app.classList.add('app');
    app.innerHTML = `
      <aside class="sidebar">
        <div class="logo-container">
          <img src=${LogoIconSrc} alt="Logo Icon" width="64" />
          <h1>ToDoMoon</h1>
        </div>
        <nav class="project-nav">
        </nav>
        <div class="project-credits">
          <p class="project-credits__author">Paul Calzado</p>
          <a class="project-credits__link" href="https://github.com/skullzado/todolist" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </aside>
      <main class="main">
        <header class="header">
          <button class="add-todo" title="Add Todo">
            Add Todo
          </button>
        </header>
      </main>
    `;

    return app;
  }

  static renderNavList(projectList: IProject[]) {
    const navigation = document.querySelector('.project-nav');
    let projectNavList;
    if (document.querySelector('.project-nav__list')) {
      projectNavList = document.querySelector(
        '.project-nav__list'
      ) as HTMLUListElement;
    } else {
      projectNavList = document.createElement('ul') as HTMLUListElement;
    }
    projectNavList.classList.add('project-nav__list');
    projectNavList.innerHTML = `
    ${projectList
      .map(
        (project) =>
          `
      <li class="project-nav__list-item">
        <button class="project-nav__btn ${
          project.title === 'Work' ? 'active' : ''
        }" title="${project.title}" data-project="${project.title}">
          ${project.title}
          <span class="project-nav__tasknumber">${project.todos.length}</span>
        </button>
      </li>
      `
      )
      .join('')}
      `;
    navigation?.appendChild(projectNavList);

    return projectNavList;
  }

  static renderTodolist(todolist?: ITodo[]) {
    const main = document.querySelector('.main');
    let list;
    if (document.querySelector('.todolist')) {
      list = document.querySelector('.todolist') as HTMLUListElement;
    } else {
      list = document.createElement('ul') as HTMLUListElement;
    }
    list.classList.add('todolist');

    if (!todolist?.length || !todolist) {
      list.innerHTML = `
          <p class="todo--empty">No todolist found...</p>
        `;
    } else {
      todolist.sort((a, b) => b.priority - a.priority);
      list.innerHTML = `
        ${todolist
          .map(
            (todo) =>
              `
              <li class="${
                todo.isCompleted
                  ? 'todo ' + PriorityLevel[todo.priority]['color']
                  : 'todo'
              }">
                <div class="todo-header">
                  <p class="todo__title">${todo.title}</p>
                  <div class="todo__priority">
                    <span class="todo__priority-level ${
                      PriorityLevel[todo.priority]['color']
                    }">
                      ${PriorityLevel[todo.priority]['level']}
                    </span>
                    <span class="todo__due-date">
                      ${
                        todo.completedDate
                          ? `Completed Date: ${format(
                              new Date(todo.completedDate),
                              'PPPP'
                            )}`
                          : `Due: ${formatDistance(
                              new Date(todo.dueDate),
                              new Date(todo.createdDate)
                            )}`
                      }
                      
                    </span>
                  </div>         
                </div>
                <div class="todo-body">
                  <div class="todo-body__details">
                    <p class="todo__created-date">Created Date: ${format(
                      new Date(todo.createdDate),
                      'PPPP'
                    )}</p>
                    <p class="todo__description">${todo.description}</p>
                  </div>
                  <div class="todo-body__actions">
                    ${
                      !todo.isCompleted
                        ? `<button class="complete-todo" title="Complete" data-id="${todo.id}">Complete</button>
                        <button class="edit-todo" title="Edit" data-id="${todo.id}">Edit</button>
                        <button class="delete-todo" title="Delete" data-id="${todo.id}">Delete</button>`
                        : `
                      <button class="delete-todo" title="Delete" data-id="${todo.id}">Delete</button>`
                    }
                  </div>
                </div>
              </li>`
          )
          .join('')}`;
    }

    main?.appendChild(list);
    return list;
  }

  static renderModal() {
    const app = document.querySelector('.app') as HTMLDivElement;
    const modalBackdrop = document.createElement('div') as HTMLDivElement;
    const modal = document.createElement('div') as HTMLDivElement;

    modalBackdrop.classList.add('modal-backdrop');
    modal.classList.add('modal');

    modalBackdrop.appendChild(modal);
    app.appendChild(modalBackdrop);
  }

  static renderForm(type: string, todo?: ITodo) {
    const modalBackdrop = document.querySelector(
      '.modal-backdrop'
    ) as HTMLDivElement;
    const modal = document.querySelector('.modal') as HTMLDivElement;

    if (!modal || !modalBackdrop) return;

    switch (type) {
      case 'ADD_TODO':
        modal.innerHTML = `
        <h2 class="modal__title">Add Todo</h2>
        <form class="modal__form">
            <label for="title">Title</label>
            <input id="title" class="modal__form-input" type="text" placeholder="Todo Title" />
            <label for="due">Due Date</label>
            <input id="due" class="modal__form-input" type="date" min="${format(
              new Date(),
              'yyyy-MM-dd'
            )}"/>
            <label for="priority">Priority Level</label>
            <select id="priority" class="modal__form-input">
              <option value="" selected disabled>Priority Level</option>
              <option value="1">Non-Priority</option>
              <option value="2">Low</option>
              <option value="3">Medium</option>
              <option value="4">High</option>
            </select>
            <label for="project">Project Type</label>
            <select id="project" class="modal__form-input">
              <option value="" selected disabled>Project Type</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="General">General</option>
            </select>
            <label for="description">Description</label>
            <textarea id="description" class="modal__form-textarea" cols="25" rows="5" placeholder="Todo Description"></textarea>
          <div class="modal__form-actions">
            <button class="cancel-btn" type="button" title="Cancel">Cancel</button>
            <button class="submit-btn" title="Submit">Submit</button>
          </div>
        </form>
      `;
        break;
      case 'EDIT_TODO':
        if (!todo) return;
        modal.innerHTML = `
        <h2 class="modal__title">Edit Todo</h2>
        <form class="modal__form" data-id="${todo.id}">
            <label for="title">Title</label>
            <input id="title" class="modal__form-input" type="text" placeholder="Todo Title" value="${
              todo.title
            }" />
            <label for="due">Due Date</label>
            <input id="due" class="modal__form-input" type="date" min="${format(
              new Date(),
              'yyyy-MM-dd'
            )}" value="${format(new Date(todo.dueDate), 'yyyy-MM-dd')}"/>
            <label for="priority">Priority Level</label>
            <select id="priority" class="modal__form-input">
              <option value="" selected disabled>Priority Level</option>
              <option value="1" ${
                todo.priority ? 'selected' : ''
              }>Non-Priority</option>
              <option value="2" ${todo.priority ? 'selected' : ''}>Low</option>
              <option value="3" ${
                todo.priority ? 'selected' : ''
              }>Medium</option>
              <option value="4" ${todo.priority ? 'selected' : ''}>High</option>
            </select>
            <label for="project">Project Type</label>
            <select id="project" class="modal__form-input" disabled>
              <option value="" selected disabled>Project Type</option>
              <option value="Work" ${
                todo.project === 'Work' ? 'selected' : ''
              }>Work</option>
              <option value="Personal" ${
                todo.project === 'Personal' ? 'selected' : ''
              }>Personal</option>
              <option value="General" ${
                todo.project === 'General' ? 'selected' : ''
              }>General</option>
            </select>
            <label for="description">Description</label>
            <textarea id="description" class="modal__form-textarea" cols="25" rows="5">${
              todo.description
            }</textarea>
          <div class="modal__form-actions">
            <button class="cancel-btn" type="button" title="Cancel">Cancel</button>
            <button class="submit-btn" title="Submit">Submit</button>
          </div>
        </form>
        
      `;
        break;
      default:
        return;
    }
  }

  static removeChildren(element: HTMLElement) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}
