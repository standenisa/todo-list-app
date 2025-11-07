
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskCount = document.getElementById('taskCount');
const clearCompleted = document.getElementById('clearCompleted');
const themeToggle = document.getElementById('themeToggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let isDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    updateTaskCount();
    initializeTheme();
});


function initializeTheme() {
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }
}

themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
});

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    updateTaskCount();
    taskInput.value = '';
    taskInput.focus();
}

function renderTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    
    let filteredTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchTerm);
        const matchesFilter = 
            currentFilter === 'all' ||
            (currentFilter === 'active' && !task.completed) ||
            (currentFilter === 'completed' && task.completed);
        
        return matchesSearch && matchesFilter;
    });
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state">📭 No tasks found</div>';
        return;
    }
    
    taskList.innerHTML = filteredTasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            >
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${task.id})">✏️ Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️ Delete</button>
            </div>
        </li>
    `).join('');
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
    updateTaskCount();
}


function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt('Edit task:', task.text);
    
    if (newText !== null && newText.trim() !== '') {
        tasks = tasks.map(t => 
            t.id === id ? { ...t, text: newText.trim() } : t
        );
        saveTasks();
        renderTasks();
    }
}
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
}

clearCompleted.addEventListener('click', () => {
    const completedCount = tasks.filter(t => t.completed).length;
    
    if (completedCount === 0) {
        alert('No completed tasks to clear!');
        return;
    }
    
    if (confirm(`Clear ${completedCount} completed task(s)?`)) {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});


searchInput.addEventListener('input', renderTasks);

function updateTaskCount() {
    const activeTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} remaining`;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

console.log('✅ To-Do App loaded successfully!');
console.log(`📝 Current tasks: ${tasks.length}`);
