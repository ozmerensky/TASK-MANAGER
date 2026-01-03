export const tasksSelectors = {
    mainTitle: '[data-cy="main-title"]',
    aiButton: '[data-cy="suggest-ai-button"]',
    tasksForm: '[data-cy="tasks-form"]',
    form: {
        categorySelector: '[data-cy="task-category"]',
        categoryOptions:{
            workoutOption: '[data-cy="workout-task-option"]',
            nutritionOption: '[data-cy="nutrition-task-option"]',
            guitarOption: '[data-cy="guitar-task-option"]',
            eventsOption: '[data-cy="events-task-option"]'
        },
        taskTitle: '[data-cy="task-title"]',
        taskDescription: '[data-cy="task-description"]',
        taskDate: '[data-cy="task-date"]',
        createTaskButton: '[data-cy="create-task-button"]'
    },
    searchTasksBar: '[data-cy="search-tasks-button"]',

    tasksListContainer: {
        tasksList: '[data-cy="tasks-list"]',
        taskItem: '[data-cy="task-item"]',
        
        taskDetails: {
            taskItemTitle: '[data-cy="task-item-title"]',
            taskItemDescrition: '[data-cy="task-item-description"]',
            taskItemDate: '[data-cy="task-item-date"]',
        },
        taskItemButtons: {
            toggleButton: '[data-cy="task-toggle-button"]',
            deleteButton: '[data-cy="task-delete-button"]',
            editButton: '[data-cy="task-edit-button"]'
        },
        taskItemEditScreen: {
            taskInputEditTitle: '[data-cy="task-edit-title-input"]',
            taskInputEditCategory: '[data-cy="task-edit-category-input"]',
            taskInputEditDescription: '[data-cy="task-edit-description-input"]',
            taskInputEditDate: '[data-cy="task-edit-date-input"]',
            saveEditButton: '[data-cy="task-save-edit-button"]',
            cancelEditButton: '[data-cy="task-cancel-edit-button"]',
            suggestAiEditButton: '[data-cy="task-suggest-ai-edit-button"]'
        }

    }
}