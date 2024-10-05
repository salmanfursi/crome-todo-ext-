
const e = React.createElement;

const TodoList = () => {
  const [tasks, setTasks] = React.useState([]);
  const [newTask, setNewTask] = React.useState('');

  React.useEffect(() => {
    chrome.storage.sync.get(['tasks'], (result) => {
      if (result.tasks) {
        setTasks(result.tasks);
      }
    });
  }, []);

  const saveTasks = (updatedTasks) => {
    chrome.storage.sync.set({ tasks: updatedTasks });
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      const updatedTasks = [...tasks, { id: Date.now(), text: newTask, completed: false }];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  return e('div', { className: 'todo-container' }, [
    e('h1', { key: 'title', className: 'todo-title' }, 'My Todo List'),
    e('div', { key: 'input', className: 'todo-input-container' }, [
      e('input', {
        key: 'task-input',
        type: 'text',
        value: newTask,
        onChange: (event) => setNewTask(event.target.value),
        placeholder: 'What needs to be done?',
        className: 'todo-input'
      }),
      e('button', { 
        key: 'add-button', 
        onClick: addTask, 
        className: 'todo-button add-button'
      }, 'Add Task')
    ]),
    e('ul', { key: 'task-list', className: 'todo-list' },
      tasks.map(task => 
        e('li', { key: task.id, className: `todo-item ${task.completed ? 'completed' : ''}` }, [
          e('div', { key: `item-content-${task.id}`, className: 'todo-item-content' }, [
            e('input', {
              key: `checkbox-${task.id}`,
              type: 'checkbox',
              checked: task.completed,
              onChange: () => toggleTask(task.id),
              className: 'todo-checkbox'
            }),
            e('span', {
              key: `text-${task.id}`,
              className: 'todo-text'
            }, task.text),
          ]),
          e('button', {
            key: `delete-${task.id}`,
            onClick: () => deleteTask(task.id),
            className: 'todo-button delete-button'
          }, 'Delete')
        ])
      )
    )
  ]);
};

ReactDOM.render(e(TodoList), document.getElementById('root'));
