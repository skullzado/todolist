import UI from './classes/UI';
import { ProjectList } from './data';
import {
  attachNavListener,
  attachShowListener,
  attachTodoActionsListeners,
} from './functions';
import './style.css';

const root = document.getElementById('root') as HTMLDivElement;

root?.appendChild(UI.renderLayout());
UI.renderNavList(ProjectList);
UI.renderTodolist(ProjectList[0].todos);
UI.renderAddTodoModal();
attachShowListener();
attachNavListener();
attachTodoActionsListeners();
