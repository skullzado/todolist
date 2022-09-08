import UI from './classes/UI';
import { ProjectList } from './data';
import './style.css';

const root = document.getElementById('root');

root?.appendChild(UI.renderLayout());
UI.renderNavList(ProjectList);
UI.renderTodolist(ProjectList[0].todos);
UI.renderAddTodoModal();
UI.attachNavListener();
UI.attachShowListener();
UI.attachDeleteListener();
UI.attachAddTodoListener();
UI.attachTodoActionsListeners();
