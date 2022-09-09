import UI from './classes/UI';
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
        console.log(todoId);

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
        UI.renderEditTodoModal(editTodoBtn?.dataset['id']!);
        const app = document.querySelector('.app') as HTMLDivElement;
        const modal = document.querySelector('.modal') as HTMLDivElement;
        const modalBackdrop = document.querySelector(
          '.modal-backdrop'
        ) as HTMLDivElement;
        app.classList.add('show');
        modal.classList.add('show');
        modalBackdrop.classList.add('show');
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
  console.log(projectComplete);

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
