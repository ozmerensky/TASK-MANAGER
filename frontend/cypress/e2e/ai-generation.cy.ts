import tasksFunctions from "../support/funcitons/tasksFunctions"
import aiFunctions from "../support/funcitons/aiFunctions"
import apiRequests from "../support/funcitons/apiFunctions/apiRequests"
import { aiSuggestions } from "../../src/mock/aiSuggestions"

describe('AI-Assisted Task Management', () => {
    before(() => {
        tasksFunctions.appEntrance();
    });
    
    it('Should generate AI task and create card with the same data', () => {
        tasksFunctions.appEntrance();
        tasksFunctions.validateMainTitle();
        apiRequests.interceptCreateTask();
        aiFunctions.generateAiTask();
        tasksFunctions.fillAiTaskForm();
        tasksFunctions.grabFormValues().then((task) => {
            tasksFunctions.submitCreateForm();
            apiRequests.waitForTaskCreationAndGetId().then(() => {
                tasksFunctions.validateCardValues(task);
                apiRequests.validateTaskInDB(task);
            });
        });
    });

    describe('Actions on existing tasks created from AI suggestions', () => {
        beforeEach(() => {
            apiRequests.createRandomTaskFromArray(aiSuggestions);
        });

        afterEach(() => {
            apiRequests.cleanupCurrentTask();
        });

        it('Should edit last task via AI suggestion and validate the update', () => {
            tasksFunctions.appEntrance();
            tasksFunctions.validateMainTitle();
            apiRequests.interceptUpdateTask();
            tasksFunctions.openEditFormOnLastTask();
            tasksFunctions.editTask();
            tasksFunctions.grabTaskValues().then((previousTask: any) => {
                aiFunctions.suggestAiEditAndVerifyChange(previousTask as { title: string; category: string; description: string; date: string }).then((newTask: any) => {
                    tasksFunctions.saveEditTask();
                    apiRequests.waitForTaskEditAndGetId().then(() => {
                        tasksFunctions.validateCardValues(newTask);
                        apiRequests.validateTaskInDB(newTask);
                    });
                });
            });
        });

        it('Should search and toggle completion status of last task via AI suggestion and validate the update', () => {
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

        it('Should find and delete the last task via AI suggestion', () => {
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
