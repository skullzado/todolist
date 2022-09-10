import UI from './classes/UI';
import Todo, { ITodo } from './classes/Todo';
import { IProject } from './classes/Project';
import { ProjectList } from './data';

const defaultActiveNav = ProjectList.find(
  (project) => project.title === 'Work'
);

// Call whenever renderTodolist() is invoked
export const attachTodoActionsListeners = () => {
  const editTodoBtns = document.querySelectorAll(
    '.edit-todo'
  ) as NodeListOf<HTMLButtonElement>;
  const deleteTodoBtns = document.querySelectorAll(
    '.delete-todo'
  ) as NodeListOf<HTMLButtonElement>;
  const completeTodoBtns = document.querySelectorAll(
    '.complete-todo'
  ) as NodeListOf<HTMLButtonElement>;

  if (completeTodoBtns) {
    completeTodoBtns.forEach((completeTodoBtn) =>
      completeTodoBtn.addEventListener('click', (event) => {
        const todoId = (event.target as HTMLButtonElement).dataset['id'];
        const projectTitle = (
          document.querySelector(
            '.project-nav__btn.active'
          ) as HTMLButtonElement
        ).dataset['project'];
        const selectedProject = ProjectList.find(
          (p) => p.title === projectTitle
        );
        if (selectedProject && todoId) {
          handleCompleteTodo(todoId, selectedProject);
        } else {
          return;
        }
      })
    );
  }
  if (editTodoBtns) {
    editTodoBtns.forEach((editTodoBtn) =>
      editTodoBtn.addEventListener('click', () => {
        const todoId = editTodoBtn?.dataset['id'];
        const app = document.querySelector('.app') as HTMLDivElement;
        const modal = document.querySelector('.modal') as HTMLDivElement;
        const modalBackdrop = document.querySelector(
          '.modal-backdrop'
        ) as HTMLDivElement;
        app.classList.add('show');
        modal.classList.add('show');
        modalBackdrop.classList.add('show');
        if (!todoId) {
          return;
        }
        UI.renderEditTodoModal(todoId);
        attachHideModalListener();
        attachEditSubmitListener();
      })
    );
  }
  if (deleteTodoBtns) {
    deleteTodoBtns.forEach((deleteBtn) =>
      deleteBtn.addEventListener('click', (event) => {
        const todoId = (event.target as HTMLButtonElement).dataset['id'];
        const projectTitle = (
          document.querySelector(
            '.project-nav__btn.active'
          ) as HTMLButtonElement
        ).dataset['project'];
        const selectedProject = ProjectList.find(
          (p) => p.title === projectTitle
        );
        if (selectedProject && todoId) {
          handleDeleteTodo(todoId, selectedProject);
        } else {
          return;
        }
      })
    );
  }
};

export const attachNavListener = () => {
  const todolist = document.querySelector('.todolist') as HTMLUListElement;
  const navBtns = document.querySelectorAll(
    '.project-nav__btn'
  ) as NodeListOf<HTMLButtonElement>;

  navBtns.forEach((navBtn) =>
    navBtn.addEventListener('click', (event) => {
      const activeBtn = document.querySelector(
        '.project-nav__btn.active'
      ) as HTMLButtonElement;
      const projectTitle = (event.target as HTMLButtonElement).dataset[
        'project'
      ];
      const selectedProject = ProjectList.find(
        (project) => project.title === projectTitle
      )!;
      if (activeBtn && activeBtn !== navBtn) {
        activeBtn.classList.remove('active');
        navBtn.classList.toggle('active');
      }
      handleNavChange(todolist, selectedProject);
    })
  );
};

const attachEventListeners = () => {
  attachShowListener();
  attachNavListener();
  attachTodoActionsListeners();
};

export const attachShowListener = () => {
  const todoHeaders = document.querySelectorAll(
    '.todo-header'
  ) as NodeListOf<HTMLDivElement>;

  todoHeaders.forEach((todo) => {
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
};

export const attachShowModalListener = () => {
  const addTodoBtn = document.querySelector('.add-todo') as HTMLButtonElement;
  addTodoBtn.addEventListener('click', () => {
    const app = document.querySelector('.app') as HTMLDivElement;
    const modal = document.querySelector('.modal') as HTMLDivElement;
    const modalBackdrop = document.querySelector(
      '.modal-backdrop'
    ) as HTMLDivElement;
    app.classList.add('show');
    modal.classList.add('show');
    modalBackdrop.classList.add('show');
  });
};

export const attachHideModalListener = () => {
  const cancelBtn = document.querySelector('.cancel-btn') as HTMLButtonElement;
  cancelBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const app = document.querySelector('.app') as HTMLDivElement;
    const modal = document.querySelector('.modal') as HTMLDivElement;
    const modalBackdrop = document.querySelector(
      '.modal-backdrop'
    ) as HTMLDivElement;
    app.classList.remove('show');
    modal.classList.remove('show');
    modalBackdrop.classList.remove('show');
  });
};

export const attachAddSubmitListener = () => {
  const form = document.querySelector('.modal__form') as HTMLFormElement;
  const app = document.querySelector('.app') as HTMLDivElement;
  const modal = document.querySelector('.modal') as HTMLDivElement;
  const modalBackdrop = document.querySelector(
    '.modal-backdrop'
  ) as HTMLDivElement;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleAddFormSubmit();
    app.classList.remove('show');
    modal.classList.remove('show');
    modalBackdrop.classList.remove('show');
    UI.removeChildren(document.querySelector('.project-nav') as HTMLDivElement);
    UI.removeChildren(document.querySelector('.todolist') as HTMLUListElement);
    UI.renderNavList(ProjectList);
    UI.renderTodolist(defaultActiveNav?.todos);
    attachEventListeners();
    attachAddSubmitListener();
    attachNavListener();
    attachTodoActionsListeners();
    attachShowModalListener();
    attachHideModalListener();
  });
  form.reset();
};

export const attachEditSubmitListener = () => {
  const form = document.querySelector('.modal__form') as HTMLFormElement;
  const todoId = form.dataset['id']!;

  const app = document.querySelector('.app') as HTMLDivElement;
  const modal = document.querySelector('.modal') as HTMLDivElement;
  const modalBackdrop = document.querySelector(
    '.modal-backdrop'
  ) as HTMLDivElement;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (todoId) {
      handleEditFormSubmit(todoId);
    }
    app.classList.remove('show');
    modal.classList.remove('show');
    modalBackdrop.classList.remove('show');
    UI.removeChildren(document.querySelector('.project-nav') as HTMLDivElement);
    UI.removeChildren(document.querySelector('.todolist') as HTMLUListElement);
    UI.renderNavList(ProjectList);
    UI.renderTodolist(defaultActiveNav?.todos);
    attachEventListeners();
    attachAddSubmitListener();
    attachNavListener();
    attachTodoActionsListeners();
    attachShowModalListener();
    attachHideModalListener();
  });
};

const handleAddFormSubmit = () => {
  const title = (document.getElementById('title') as HTMLInputElement).value;
  const date = (document.getElementById('due') as HTMLInputElement).value;
  const priority = (document.getElementById('priority') as HTMLSelectElement)
    .value;
  const projectTitle = (document.getElementById('project') as HTMLSelectElement)
    .value;
  const description = (
    document.getElementById('description') as HTMLTextAreaElement
  ).value;
  const project = ProjectList.find((p) => p.title === projectTitle)!;

  if (title && date && priority && description && projectTitle) {
    project?.addTodo(
      new Todo(title, description, Number(priority), date, projectTitle)
    );
  }
};

const handleEditFormSubmit = (todoId: string) => {
  console.log(todoId);

  const title = (document.getElementById('title') as HTMLInputElement).value;
  const date = (document.getElementById('due') as HTMLInputElement).value;
  const priority = (document.getElementById('priority') as HTMLSelectElement)
    .value;
  const description = (
    document.getElementById('description') as HTMLTextAreaElement
  ).value;
  const projectTitle = (document.getElementById('project') as HTMLSelectElement)
    .value;
  const project = ProjectList.find((p) => p.title === projectTitle);
  if (title && date && priority && description) {
    project?.updateTodo(
      todoId,
      new Todo(title, description, Number(priority), date, projectTitle)
    );
  }
};

const handleDeleteTodo = (todoId: string, selectedProject: IProject) => {
  selectedProject.deleteTodo(todoId);
  UI.removeChildren(document.querySelector('.project-nav') as HTMLDivElement);
  UI.removeChildren(document.querySelector('.todolist') as HTMLUListElement);
  UI.renderNavList(ProjectList);
  UI.renderTodolist(defaultActiveNav?.todos);
  attachEventListeners();
};

const handleCompleteTodo = (todoId: string, selectedProject: IProject) => {
  selectedProject.completeTodo(todoId);
  const selectedTodo = selectedProject.todos.find(
    (todo) => todo.isCompleted === true
  )!;
  if (!selectedTodo) return;
  const projectComplete = ProjectList.find((p) => p.title === 'Completed');
  projectComplete?.addTodo(selectedTodo);
  selectedProject.deleteTodo(selectedTodo?.id);
  UI.removeChildren(document.querySelector('.project-nav') as HTMLDivElement);
  UI.removeChildren(document.querySelector('.todolist') as HTMLUListElement);
  UI.renderNavList(ProjectList);
  UI.renderTodolist(defaultActiveNav?.todos);
  attachEventListeners();
};

const handleNavChange = (
  todolistEl: HTMLUListElement,
  selectedProject: IProject
) => {
  if (todolistEl) {
    UI.removeChildren(todolistEl);
  }
  UI.renderTodolist(selectedProject?.todos);
  attachShowListener();
  attachTodoActionsListeners();
};
