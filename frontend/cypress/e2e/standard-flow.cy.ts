import tasksFunctions from "../support/funcitons/tasksFunctions"
import apiRequests from "../support/funcitons/apiFunctions/apiRequests"

describe('Standard User Task Flow', () => {
    before(() => {
        tasksFunctions.appEntrance();
    });

    it('Should create a task by typing into the form and validate DB', () => {
        cy.fixture('tasks').then((tasks) => {
            tasksFunctions.appEntrance();
            tasksFunctions.validateMainTitle();
            apiRequests.interceptCreateTask();
            tasksFunctions.fillManualTaskForm(tasks.created);
            tasksFunctions.grabFormValues().then((task) => {
                tasksFunctions.submitCreateForm();
                apiRequests.waitForTaskCreationAndGetId().then(() => {
                    tasksFunctions.validateCardValues(task);
                    apiRequests.validateTaskInDB(task);
                });
            });
        });
    });

    describe('Actions on existing tasks created from fixtures', () => {
        beforeEach(() => {
            cy.fixture('tasks').then((tasks) => {
                apiRequests.createRandomTaskFromArray(tasks.created);
            });
        });

        afterEach(() => {
            apiRequests.cleanupCurrentTask();
        });

        it('Should edit last task and validate the update', () => {
            cy.fixture('tasks').then((tasks) => {
                tasksFunctions.appEntrance();
                tasksFunctions.validateMainTitle();
                apiRequests.interceptUpdateTask();
                tasksFunctions.openEditFormOnLastTask();
                tasksFunctions.editTask();
                tasksFunctions.fillManualTaskEditForm(tasks.edited);
                tasksFunctions.grabTaskValues().then((newTask: any) => {
                    tasksFunctions.saveEditTask();
                    apiRequests.waitForTaskEditAndGetId().then(() => {
                        tasksFunctions.validateCardValues(newTask);
                        apiRequests.validateTaskInDB(newTask);
                    });
                });
            });
        });

        it('Should search and toggle completion status of last task and validate the update', () => {
            tasksFunctions.appEntrance();
            tasksFunctions.validateMainTitle();
            apiRequests.interceptUpdateTask();
            tasksFunctions.openEditFormOnLastTask();
            tasksFunctions.searchTaskByTitle();
            tasksFunctions.toggleCompletionOnFoundTask();
            apiRequests.waitForTaskEditAndGetId().then(() => {
                tasksFunctions.validateToggleChangedStatus();
                apiRequests.validateCompletedTask();
            });
        });

        it('Should find and delete the last task', () => {
            tasksFunctions.appEntrance();
            tasksFunctions.validateMainTitle();
            apiRequests.interceptDeleteTask();
            tasksFunctions.openEditFormOnLastTask();
            tasksFunctions.searchTaskByTitle();
            tasksFunctions.deleteTask();
            
            apiRequests.waitForTaskDeleteAndGetId().then(() => {
                apiRequests.validateDeletedTask();
            });
        });
    });
});
