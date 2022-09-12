import UI from './classes/UI';
import Todo, { ITodo } from './classes/Todo';
import Project, { IProject } from './classes/Project';
import { convertedData, setData } from './data';

const defaultActiveNav: IProject = convertedData().find(
  (project: IProject) => project.title === 'Work'
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

        if (!todoId || !projectTitle) return;
        handleCompleteTodo(todoId, projectTitle);
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

        if (!todoId || !projectTitle) return;
        handleDeleteTodo(todoId, projectTitle);
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
      const selectedProject = convertedData().find(
        (project: IProject) => project.title === projectTitle
      )!;
      if (activeBtn && activeBtn !== navBtn) {
        activeBtn.classList.remove('active');
        navBtn.classList.toggle('active');
      }
      handleNavChange(todolist, selectedProject);
    })
  );
};

export const attachShowTodoListener = () => {
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

export const attachAddBtnListener = () => {
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
    UI.renderForm('ADD_TODO');
    attachCancelBtnListener();
  });
};

export const attachCancelBtnListener = () => {
  const cancelBtn = document.querySelector('.cancel-btn') as HTMLButtonElement;
  cancelBtn.addEventListener('click', () => {
    const app = document.querySelector('.app') as HTMLDivElement;
    const modal = document.querySelector('.modal') as HTMLDivElement;
    const modalBackdrop = document.querySelector(
      '.modal-backdrop'
    ) as HTMLDivElement;
    app.classList.remove('show');
    modal.classList.remove('show');
    modalBackdrop.classList.remove('show');
    UI.removeChildren(modal);
  });
};

// export const attachAddSubmitListener = () => {
//   const form = document.querySelector('.modal__form') as HTMLFormElement;
//   const app = document.querySelector('.app') as HTMLDivElement;
//   const modal = document.querySelector('.modal') as HTMLDivElement;
//   const modalBackdrop = document.querySelector(
//     '.modal-backdrop'
//   ) as HTMLDivElement;
//   form.addEventListener('submit', (event) => {
//     event.preventDefault();

//     handleAddFormSubmit();
//     app.classList.remove('show');
//     modal.classList.remove('show');
//     modalBackdrop.classList.remove('show');
//     UI.removeChildren(document.querySelector('.project-nav') as HTMLDivElement);
//     UI.removeChildren(document.querySelector('.todolist') as HTMLUListElement);
//     UI.renderNavList(localData);
//     UI.renderTodolist(defaultActiveNav?.todos);
//     attachEventListeners();
//     attachAddSubmitListener();
//     attachNavListener();
//     attachTodoActionsListeners();
//     attachShowModalListener();
//     attachHideModalListener();
//   });
//   form.reset();
// };

// export const attachEditSubmitListener = () => {
//   const form = document.querySelector('.modal__form') as HTMLFormElement;
//   const todoId = form.dataset['id']!;

//   const app = document.querySelector('.app') as HTMLDivElement;
//   const modal = document.querySelector('.modal') as HTMLDivElement;
//   const modalBackdrop = document.querySelector(
//     '.modal-backdrop'
//   ) as HTMLDivElement;
//   form.addEventListener('submit', (event) => {
//     event.preventDefault();

//     if (todoId) {
//       handleEditFormSubmit(todoId);
//     }
//     app.classList.remove('show');
//     modal.classList.remove('show');
//     modalBackdrop.classList.remove('show');
//   });
// };

// const handleAddFormSubmit = () => {
//   const title = (document.getElementById('title') as HTMLInputElement).value;
//   const date = (document.getElementById('due') as HTMLInputElement).value;
//   const priority = (document.getElementById('priority') as HTMLSelectElement)
//     .value;
//   const projectTitle = (document.getElementById('project') as HTMLSelectElement)
//     .value;
//   const description = (
//     document.getElementById('description') as HTMLTextAreaElement
//   ).value;
//   const retrievedProject = localData.find((p) => p.title === projectTitle);
//   if (!retrievedProject) return;
//   const newProject = new Project(
//     retrievedProject.title,
//     retrievedProject.todos
//   );
//   if (title && date && priority && description) {
//     newProject?.addTodo(
//       new Todo(title, description, Number(priority), date, projectTitle)
//     );
//   }
//   localStorage.setItem('todos', JSON.stringify(localData));
// };

// const handleEditFormSubmit = (todoId: string) => {
//   const title = (document.getElementById('title') as HTMLInputElement).value;
//   const date = (document.getElementById('due') as HTMLInputElement).value;
//   const priority = (document.getElementById('priority') as HTMLSelectElement)
//     .value;
//   const description = (
//     document.getElementById('description') as HTMLTextAreaElement
//   ).value;
//   const projectTitle = (document.getElementById('project') as HTMLSelectElement)
//     .value;
//   const retrievedProject = localData.find((p) => p.title === projectTitle);
//   if (!retrievedProject) return;
//   // const newProject = new Project(
//   //   retrievedProject.title,
//   //   retrievedProject.todos
//   // );
//   if (title && date && priority && description && retrievedProject) {
//     retrievedProject?.updateTodo(todoId, {
//       title,
//       description,
//       priority: Number(priority),
//       dueDate: date,
//     });
//   }
//   localStorage.setItem('todos', JSON.stringify(localData));
// };

const handleDeleteTodo = (todoId: string, projectTitle: string) => {
  const selectedProject: IProject = convertedData().find(
    (project: IProject) => project.title === projectTitle
  );
  selectedProject.deleteTodo(todoId);
  const newData = convertedData().map((project: IProject) => {
    if (project.title === projectTitle) {
      Object.assign(project, selectedProject);
    }
    return project;
  });

  setData(newData);
  UI.removeChildren(document.querySelector('.project-nav') as HTMLDivElement);
  UI.removeChildren(document.querySelector('.todolist') as HTMLUListElement);
  UI.renderNavList(newData);
  UI.renderTodolist(selectedProject?.todos);
  attachNavListener();
  attachShowTodoListener();
  attachTodoActionsListeners();
};

const handleCompleteTodo = (todoId: string, projectTitle: string) => {
  const selectedProject = convertedData().find(
    (project: IProject) => project.title === projectTitle
  );
  const selectedTodo = selectedProject.todos.find(
    (todo: ITodo) => todo.id === todoId
  );
  const projectComplete = convertedData().find(
    (project: IProject) => project.title === 'Completed'
  );
  if (!selectedProject || !selectedTodo || !projectComplete) return;
  selectedProject.completeTodo(todoId);
  console.log(selectedProject);
  projectComplete.addTodo(selectedTodo);
  console.log(projectComplete);
  selectedProject.deleteTodo(todoId);
  console.log(selectedProject);
  const newData = convertedData().map((project: IProject) => {
    if (project.title === selectedProject.title) {
      project = Object.assign(project, selectedProject);
    } else if (project.title === projectComplete.title) {
      project = Object.assign(project, projectComplete);
    }
    return project;
  });
  setData(newData);
  console.log(newData);
  UI.removeChildren(document.querySelector('.project-nav') as HTMLDivElement);
  UI.removeChildren(document.querySelector('.todolist') as HTMLUListElement);
  UI.renderNavList(newData);
  UI.renderTodolist(selectedProject?.todos);
  attachNavListener();
  attachShowTodoListener();
  attachTodoActionsListeners();
};

const handleNavChange = (
  todolistEl: HTMLUListElement,
  selectedProject: IProject
) => {
  if (todolistEl) {
    UI.removeChildren(todolistEl);
  }
  UI.renderTodolist(selectedProject?.todos);
  attachShowTodoListener();
  attachTodoActionsListeners();
};
