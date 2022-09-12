import UI from './classes/UI';
import { convertedData } from './data';
import {
  attachAddBtnListener,
  attachEditSubmitListener,
  attachNavListener,
  attachShowTodoListener,
  attachTodoActionsListeners,
} from './functions';
import './style.css';

const root = document.getElementById('root') as HTMLDivElement;

root?.appendChild(UI.renderLayout());
UI.renderNavList(convertedData());
UI.renderTodolist(convertedData()[0].todos);
UI.renderModal();
attachAddBtnListener();
attachNavListener();
attachShowTodoListener();
attachTodoActionsListeners();
