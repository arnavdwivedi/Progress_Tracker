document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const overallProgressBar = document.getElementById('overall-progress-bar');
    const overallProgressText = document.getElementById('overall-progress-text');
    const singleTaskModal = document.getElementById('single-task-modal');
    const allTasksModal = document.getElementById('all-tasks-modal');
    const closeButtons = document.querySelectorAll('.close-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();

    // --- Event Listeners ---
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            singleTaskModal.style.display = 'none';
            allTasksModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target == singleTaskModal || e.target == allTasksModal) {
            singleTaskModal.style.display = 'none';
            allTasksModal.style.display = 'none';
        }
    });

    // --- UPDATED LOGIC in handleStep ---
    function handleStep(e) {
        const index = e.target.dataset.index;
        const task = tasks[index];

        if (task.progress < 100) {
            task.progress += 25;
            
            // Check for completion
            if (task.progress === 100) {
                const allCompleted = tasks.every(t => t.progress === 100);
                
                if (allCompleted) {
                    // Show popups in sequence if all tasks are done
                    showSequentialPopups();
                } else {
                    // Otherwise, just show the single task popup
                    singleTaskModal.style.display = 'flex';
                }
            }
            saveAndRender();
        }
    }

    // --- NEW FUNCTION for sequential popups ---
    function showSequentialPopups() {
        // 1. Show the single task completion popup first
        singleTaskModal.style.display = 'flex';

        // 2. After a delay, hide the first popup and show the final one
        setTimeout(() => {
            singleTaskModal.style.display = 'none';
            allTasksModal.style.display = 'flex';
        }, 2000); // 2-second delay
    }

    // --- All other functions remain the same ---
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return alert('Please enter a task.');
        tasks.push({ text: taskText, progress: 0 });
        taskInput.value = '';
        saveAndRender();
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.progress === 100 ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="task-header">
                    <span class="task-text">${task.text}</span>
                    <div class="task-buttons">
                        <button class="edit-btn" data-index="${index}">✏️</button>
                        <button class="delete-btn" data-index="${index}">✖</button>
                    </div>
                </div>
                <div class="task-item-controls">
                    <div class="task-progress-bar-container">
                        <div class="task-progress-bar" style="width: ${task.progress}%;"></div>
                    </div>
                    <div class="task-action-buttons">
                        <button class="rollback-btn" data-index="${index}" ${task.progress === 0 ? 'disabled' : ''}>Rollback</button>
                        <span class="task-progress-value">${task.progress}%</span>
                        <button class="step-btn" data-index="${index}" ${task.progress === 100 ? 'disabled' : ''}>Mark Next Step</button>
                    </div>
                </div>
            `;
            taskList.appendChild(li);
        });
        updateOverallProgress();
        addEventListenersToControls();
    }
    
    function addEventListenersToControls() {
        document.querySelectorAll('.step-btn').forEach(btn => btn.addEventListener('click', handleStep));
        document.querySelectorAll('.rollback-btn').forEach(btn => btn.addEventListener('click', handleRollback));
        document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', editTask));
        document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', deleteTask));
    }

    function handleRollback(e) {
        const index = e.target.dataset.index;
        if (tasks[index].progress > 0) {
            tasks[index].progress -= 25;
            saveAndRender();
        }
    }
    
    function editTask(e) {
        const index = e.target.dataset.index;
        const newText = prompt('Edit your task:', tasks[index].text);
        if (newText !== null && newText.trim() !== '') {
            tasks[index].text = newText.trim();
            saveAndRender();
        }
    }

    function deleteTask(e) {
        const index = e.target.dataset.index;
        if (confirm('Are you sure you want to delete this task?')) {
            tasks.splice(index, 1);
            saveAndRender();
        }
    }
    
    function updateOverallProgress() {
        if (tasks.length === 0) {
            overallProgressBar.style.width = '0%';
            overallProgressText.textContent = '0% Average Completion';
            return;
        }
        const totalProgress = tasks.reduce((sum, task) => sum + (Number(task.progress) || 0), 0);
        const averageProgress = totalProgress / tasks.length;
        overallProgressBar.style.width = `${averageProgress}%`;
        overallProgressText.textContent = `${Math.round(averageProgress)}% Average Completion`;
    }

    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
});
