import UI from './classes/UI';
import { ProjectList } from './data';
import {
  attachShowModalListener,
  attachNavListener,
  attachShowListener,
  attachTodoActionsListeners,
  attachHideModalListener,
  attachAddSubmitListener,
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
attachShowModalListener();
attachHideModalListener();
attachAddSubmitListener();
