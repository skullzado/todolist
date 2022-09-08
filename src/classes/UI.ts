import formatDistance from 'date-fns/formatDistance';
import format from 'date-fns/format';
import LogoIconSrc from '../assets/logo-icon.png';
import { ProjectList } from '../data';
import Todo, { ITodo } from './Todo';
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
    if (document.querySelector('project-nav__list')) {
      projectNavList = document.querySelector(
        'project-nav__list'
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
          <span class="project-nav__tasknumber">${project.taskNumber}</span>
        </button>
      </li>
      `
      )
      .join('')}
      `;
    navigation?.appendChild(projectNavList);

    return projectNavList;
  }

  static renderTodolist(todolist: ITodo[] | []) {
    const main = document.querySelector('.main');
    let list;
    if (document.querySelector('.todolist')) {
      list = document.querySelector('.todolist') as HTMLUListElement;
    } else {
      list = document.createElement('ul') as HTMLUListElement;
    }
    list.classList.add('todolist');
    if (main) {
      if (!todolist.length) {
        list.innerHTML = `
          <p>No todolist found...</p>
        `;
      } else {
        list.innerHTML = `
        ${todolist
          .map(
            (todo) =>
              `
            <li class="todo">
              <div class="todo-header">
                <h4 class="todo__title">${todo.title}</h4>
                <div class="todo__priority">
                  <span class="todo__priority-level ${
                    PriorityLevel[todo.priority]['color']
                  }">
                    ${PriorityLevel[todo.priority]['level']}
                  </span>
                  <span class="todo__due-date">
                    Due Date: ${formatDistance(
                      new Date(todo.dueDate),
                      new Date(todo.createdDate)
                    )}
                  </span>
                </div>         
              </div>
              <div class="todo-body">
                <div class="todo-body__details>
                  <p class="todo__created-date">Created Date: ${format(
                    new Date(todo.createdDate),
                    'PPP'
                  )}</p>
                  <p class="todo__description">${todo.description}</p>
                </div>
                <div class="todo-body__actions">
                  <button class="edit-todo" title="Edit">Edit</button>
                  <button class="delete-todo" title="Delete" data-id="${
                    todo.id
                  }">Delete</button>
                </div>
              </div>
            </li>
          `
          )
          .join('')}
      `;
      }
    }
    main?.appendChild(list);
    return list;
  }

  static attachNavListener() {
    const navBtns = document.querySelectorAll('.project-nav__btn');
    navBtns.forEach((navBtn) => {
      navBtn.addEventListener('click', (event) => {
        const activeBtn = document.querySelector('.project-nav__btn.active');
        const projectTitle = (event.target as HTMLButtonElement).dataset[
          'project'
        ];
        const project = ProjectList.find(
          (project) => project.title === projectTitle
        );

        if (activeBtn && activeBtn !== navBtn) {
          this.removeChildren(
            document.querySelector('.todolist') as HTMLUListElement
          );
          if (!project) {
            this.renderTodolist([]);
          } else {
            this.renderTodolist(project?.todos);
            this.attachDeleteListener();
            this.attachShowListener();
            activeBtn.classList.remove('active');
            navBtn.classList.toggle('active');
          }
        }
      });
    });
  }

  static attachShowListener() {
    const todos = document.querySelectorAll('.todo-header');

    todos.forEach((todo) => {
      todo.addEventListener('click', () => {
        const activeTodo = document.querySelector('.todo-body.show');
        if (activeTodo && activeTodo !== todo.nextElementSibling) {
          activeTodo.classList.remove('show');
          todo.nextElementSibling?.classList.toggle('show');
        } else {
          todo.nextElementSibling?.classList.toggle('show');
        }
      });
    });
  }

  static attachDeleteListener() {
    const deleteBtns = document.querySelectorAll('.delete-todo');

    deleteBtns.forEach((deleteBtn) => {
      deleteBtn.addEventListener('click', (event) => {
        const todoId = (event.target as HTMLButtonElement).dataset['id'];
        const projectTitle = (
          document.querySelector(
            '.project-nav__btn.active'
          ) as HTMLButtonElement
        ).dataset['project'];
        const project = ProjectList.find((p) => p.title === projectTitle);
        if (project && todoId) {
          const newTodos = project.deleteTodo(todoId);
          this.removeChildren(
            document.querySelector('.project-nav') as HTMLDivElement
          );
          this.removeChildren(
            document.querySelector('.todolist') as HTMLUListElement
          );
          this.renderNavList(ProjectList);
          this.renderTodolist(newTodos);
          this.attachNavListener();
          this.attachShowListener();
          this.attachDeleteListener();
        } else {
          return;
        }
      });
    });
  }

  static renderAddTodoModal() {
    const app = document.querySelector('.app');
    let modalBackdrop;
    let modal;
    if (
      document.querySelector('.modal') &&
      document.querySelector('.modal-backdrop')
    ) {
      modal = document.querySelector('.modal') as HTMLDivElement;
      modalBackdrop = document.querySelector('.modal-backdrop');
    } else {
      modal = document.createElement('div');
      modalBackdrop = document.createElement('div');
    }
    modalBackdrop?.classList.add('modal-backdrop');
    modal.classList.add('modal');
    if (modal.children.length) {
      this.removeChildren(modal);
    } else {
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
    }
    modalBackdrop?.appendChild(modal);
    app?.appendChild(modalBackdrop!);
    return modal;
  }

  static attachAddTodoListener() {
    const addTodo = document.querySelector('.add-todo') as HTMLButtonElement;

    addTodo.addEventListener('click', () => {
      const app = document.querySelector('.app') as HTMLDivElement;
      const modal = document.querySelector('.modal') as HTMLDivElement;
      const modalBackdrop = document.querySelector(
        '.modal-backdrop'
      ) as HTMLDivElement;
      app.classList.add('show');
      modal.classList.add('show');
      modalBackdrop.classList.add('show');
    });
  }

  static attachTodoActionsListeners() {
    const cancelBtn = document.querySelector(
      '.cancel-btn'
    ) as HTMLButtonElement;
    const form = document.querySelector('.modal__form') as HTMLFormElement;
    const app = document.querySelector('.app') as HTMLDivElement;
    const modal = document.querySelector('.modal') as HTMLDivElement;
    const modalBackdrop = document.querySelector(
      '.modal-backdrop'
    ) as HTMLDivElement;

    cancelBtn.addEventListener('click', (event) => {
      event.preventDefault();

      app.classList.remove('show');
      modal.classList.remove('show');
      modalBackdrop.classList.remove('show');
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const activeBtn = (
        document.querySelector('.project-nav__btn') as HTMLButtonElement
      ).dataset['project'];
      let title = (document.getElementById('title') as HTMLInputElement).value;
      let date = (document.getElementById('due') as HTMLInputElement).value;
      let priority = (document.getElementById('priority') as HTMLSelectElement)
        .value;
      let projectTitle = (
        document.getElementById('project') as HTMLSelectElement
      ).value;
      let description = (
        document.getElementById('description') as HTMLTextAreaElement
      ).value;
      const project = ProjectList.find((p) => p.title === projectTitle);

      if (title && date && priority && projectTitle && description && project) {
        project.addTodo(new Todo(title, description, Number(priority), date));
      }

      if (project?.title === activeBtn) {
        this.renderTodolist(project?.todos ?? []);
      }

      app.classList.remove('show');
      modal.classList.remove('show');
      modalBackdrop.classList.remove('show');
      this.removeChildren(
        document.querySelector('.project-nav') as HTMLUListElement
      );
      this.renderNavList(ProjectList);
      this.attachNavListener();
      this.attachShowListener();
      this.attachDeleteListener();
      form.reset();
    });
  }

  static removeChildren(element: HTMLElement) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}
