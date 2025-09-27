Progress Tracker (Task Manager)
A lightweight, browser-based task manager with step-wise progress, average completion tracking, and celebratory popups for single-task and all-tasks completion events.

Features
Add, edit, delete tasks with persistent storage via LocalStorage.

Per-task progress in 25% steps: 0 → 25 → 50 → 75 → 100, with rollback support.

Overall average completion bar and percentage text across all tasks.

Two celebratory modals:

Single task completion popup when a task hits 100%.

“All tasks completed” popup when every task reaches 100%, shown after the single popup in a sequence.

Clean, responsive UI with accessible controls and smooth transitions.

Tech Stack
HTML5 for structure.

CSS3 for layout, theming, transitions, and modals.

Vanilla JavaScript (no dependencies) for state, events, and DOM updates.

Getting Started
Prerequisites
Any modern desktop or mobile browser with LocalStorage enabled.

Installation
Download or clone the repository files: index.html, style.css, script.js into the same folder.

Open index.html in a browser to run the app locally; no server is required.

File Structure
index.html — App markup and modal containers.

style.css — Layout, progress bars, buttons, and modal styles.

script.js — State management, event handlers, rendering, and modal logic.

Usage
Add a task
Enter a task in the input field and click “Add Task” or press Enter.

Advance progress
Click “Mark Next Step” on a task to increase progress by 25% until it reaches 100%.

When a task hits 100%, a “Congratulations!” popup appears.

Roll back progress
Use “Rollback” to decrease progress by 25% (disabled at 0%).

Edit or delete
Click the edit icon to rename a task (via prompt), or delete to remove it (with confirmation).

Overall progress
The header shows the average completion across all tasks and animates a progress bar accordingly.

Completion flow
If the last remaining task reaches 100%, the app first shows the single-task popup, then after 2 seconds hides it and shows the “All Tasks Completed!” popup.

All state is saved to LocalStorage, so tasks persist across browser sessions on the same device.

Accessibility and UX
Clear visual states for completed tasks (line-through and subtle background).

Buttons disabled when actions are not applicable (e.g., Mark Next Step at 100%, Rollback at 0%).

Large click targets and responsive layout up to 600px container width, suitable for mobile and desktop.

Code Walkthrough
index.html
Container layout with:

Title, input section (text input + Add button), overall progress section (bar + percentage), and task list <ul>.

Two modal dialogs:

Single task completion modal (#single-task-modal).

All tasks completed modal (#all-tasks-modal).

script.js is loaded at the end of body for safe DOM access after parsing.

Key elements:

#task-input — text input for new tasks.

#add-task-btn — button to add tasks.

#task-list — container where tasks are rendered dynamically.

#overall-progress-bar and #overall-progress-text — average completion UI.

.modal structures with .close-btn for dismissing popups.

Why: Keeping modal markup in HTML allows CSS transitions and JS toggling via display changes; rendering list items from JS centralizes state-driven UI.

style.css
Global layout: centered container, card styling, and subtle shadows for depth.

Input and button styles: spacing, colors, and hover states for primary actions.

Progress bars:

Global bar: .progress-bar within .progress-bar-container, animated width updates.

Per-task bar: .task-progress-bar with smooth transitions on width change.

Task items:

Completed tasks get line-through and tinted background; header with action buttons aligned right.

Action buttons:

.step-btn (blue), .rollback-btn (amber), disabled states gray with not-allowed cursor.

Modals:

.modal covers viewport with semi-transparent backdrop; .modal-content as centered card.

.modal-content.all-done variant is wider and uses blue accent, larger heading.

Basic fade-in animation and close button positioning.

Why: Visual hierarchy and motion affordances help users track state changes without overwhelming them; disabled states prevent invalid actions.

script.js
State and DOM references
Selects core elements (input, buttons, lists, progress UI, modals, close buttons) once on DOMContentLoaded for efficiency.

Loads tasks from LocalStorage: let tasks = JSON.parse(localStorage.getItem('tasks')) || [] .

Initial render via renderTasks() to sync UI with stored state.

Why: LocalStorage ensures persistence, and a single source of truth (tasks array) drives idempotent renders.

Event wiring
Add button click and Enter key on input both call addTask().

Modal close buttons (.close-btn) and clicking outside modal content hide any open modal.

After every render, buttons inside task items are re-bound:

.step-btn → handleStep

.rollback-btn → handleRollback

.edit-btn → editTask

.delete-btn → deleteTask.

Why: Task items are re-created on each render; event delegation is replaced by re-binding to ensure handlers attach to fresh nodes.

Add task
Validates non-empty text; creates new task object: { text, progress: 0 }.

Saves and re-renders; input is cleared.

Render tasks
Clears list, then for each task generates an <li> with:

Header: task text and edit/delete buttons.

Controls:

Per-task progress bar with inline width style based on progress.

Action row with “Rollback”, current percentage, and “Mark Next Step”, where buttons are disabled at bounds.

Applies .completed class when progress === 100 for styling.

Calls updateOverallProgress() and then wires controls.

Why: Declarative re-render avoids bugs from incremental DOM mutations; disabled states keep logic simple in handlers.

Step forward (handleStep)
Reads task by index from data-index attribute.

If progress < 100, increments by 25 and then checks completion.

If the task just reached 100:

Checks whether all tasks are now at 100%.

If all completed, runs showSequentialPopups():

Show single-task modal, then after 2s hide it and show all-tasks modal.

Else, shows only the single-task modal.

Persists and re-renders via saveAndRender().

Why: The sequential popup pattern ensures celebratory feedback for both the individual accomplishment and the overall milestone without overlapping modals.

Rollback (handleRollback)
Decrements progress by 25 if above 0; persists and re-renders.

Edit and delete
editTask: prompt for new text; updates if changed and non-empty.

deleteTask: confirm, splice task, then persist and render.

Overall average
If no tasks, shows 0% and sets bar width to 0%.

Else, computes mean: sum of progress / number of tasks.

Sets bar width and text to rounded percentage.

Why: Average completion gives a quick macro-level sense of progress across the list; animating width improves clarity of change.

Persistence helper
saveAndRender() writes LocalStorage and calls renderTasks() to refresh UI.

Extending the App
More granular steps: change increment/decrement from 25 to 10 and update button labels accordingly.

Due dates and sorting: extend task objects with dueDate and sort by date or completion state.

Subtasks: add nested arrays and compute progress as average of subtasks.

Keyboard accessibility: add aria attributes and keyboard handling for modals and buttons.

Theming: define CSS variables for colors to enable light/dark themes.

Known Behaviors
If every task is already at 100% and another step is attempted, the “Mark Next Step” is disabled, so no modal appears; this prevents redundant popups.

Clicking the backdrop of an open modal closes it to avoid trapping focus.

Troubleshooting
Tasks don’t persist:

Ensure the browser allows LocalStorage and the page is being opened via a file:// or http(s) origin that supports it.

Buttons not responding:

Make sure index.html, style.css, and script.js are in the same folder and script is loaded at the end of body.

Popups not showing:

Verify the modals exist in index.html and the CSS .modal display toggling isn’t overridden by custom styles.

License
This project uses a simple permissive license by default; adjust as needed for redistribution or contributions.
