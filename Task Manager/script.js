const taskList = document.getElementById('task-list');
const archiveList = document.getElementById('archive-list');
const inprogressList = document.getElementById('inprogress-list');
const completedList = document.getElementById('completed-list');
const modal = document.getElementById('modal');
const addTaskBtn = document.getElementById('add-task-btn');
const closeModalBtn = document.getElementById('close-modal');
const saveTaskBtn = document.getElementById('save-task');
const taskTextInput = document.getElementById('task-text');
const taskStatusInput = document.getElementById('task-status');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let archive = JSON.parse(localStorage.getItem('archive')) || [];

function showSection(name) {
  document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');

  document.getElementById(name + '-section').style.display = 'block';

  if (name === 'archive') renderArchive();
  if (name === 'inprogress') renderFiltered('in-progress');
  if (name === 'completed') renderFiltered('completed');
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = createTaskElement(task, index);
    taskList.appendChild(li);
  });
}

function renderFiltered(status) {
  const targetList = status === 'in-progress' ? inprogressList : completedList;
  targetList.innerHTML = '';
  tasks.forEach((task, index) => {
    if (task.status === status) {
      const li = createTaskElement(task, index);
      targetList.appendChild(li);
    }
  });
}

function createTaskElement(task, index) {
  const li = document.createElement('li');

  const text = document.createElement('div');
  text.textContent = task.text;
  text.ondblclick = () => {
    const newText = prompt('Редактировать задачу:', task.text);
    if (newText) {
      task.text = newText.trim();
      saveTasks();
      refreshAll();
    }
  };

  const right = document.createElement('div');
  right.style.display = 'flex';
  right.style.alignItems = 'center';
  right.style.gap = '10px';

  const status = document.createElement('span');
  status.className = 'status ' + task.status;
  status.textContent = task.status === 'today' ? 'Сегодня' :
                       task.status === 'in-progress' ? 'В процессе' :
                       'Выполнено';

  status.onclick = () => {
    if (task.status === 'today') task.status = 'in-progress';
    else if (task.status === 'in-progress') task.status = 'completed';
    else {
      archive.unshift(task);
      tasks.splice(index, 1);
    }
    saveTasks();
    refreshAll();
  };

  const del = document.createElement('button');
  del.textContent = 'Удалить';
  del.className = 'delete-btn';
  del.onclick = () => {
    tasks.splice(index, 1);
    saveTasks();
    refreshAll();
  };

  right.appendChild(status);
  right.appendChild(del);
  li.appendChild(text);
  li.appendChild(right);
  return li;
}

function renderArchive() {
  archiveList.innerHTML = '';
  archive.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.text;
    archiveList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('archive', JSON.stringify(archive));
}

function refreshAll() {
  renderTasks();
  renderFiltered('in-progress');
  renderFiltered('completed');
  renderArchive();
}

addTaskBtn.onclick = () => modal.classList.remove('hidden');
closeModalBtn.onclick = () => modal.classList.add('hidden');

saveTaskBtn.onclick = () => {
  const text = taskTextInput.value.trim();
  const status = taskStatusInput.value;
  if (text) {
    tasks.unshift({ text, status });
    saveTasks();
    refreshAll();
    taskTextInput.value = '';
    modal.classList.add('hidden');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});