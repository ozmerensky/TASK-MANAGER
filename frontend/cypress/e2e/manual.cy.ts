import tasksFunctions from "../support/funcitons/tasksFunctions"
import apiRequests from "../support/funcitons/apiFunctions/apiRequests"
import { times } from "../support/mapping/constants/times"
import { tasksSelectors } from "../support/mapping/tasksMapping"

describe('Manual Task Flow', () => {
    it('Should create a task by typing into the form and validate DB', () => {
        cy.fixture('tasksManual').then((tasks) => {
            tasksFunctions.appEntrance()
            tasksFunctions.validateMainTitle()
            apiRequests.interceptCreateTask()
            tasksFunctions.fillManualTaskForm(tasks.created)
            tasksFunctions.grabFormValues().then((task) => {
                tasksFunctions.submitCreateForm()
                apiRequests.waitForTaskCreationAndGetId()
                tasksFunctions.validateCardValues(task)
                apiRequests.validateTaskInDB(task)
            })
        })
    })
    it('Should edit last task and validate the update', () => {
        cy.fixture('tasksManual').then((tasks) => {
            tasksFunctions.appEntrance()
            tasksFunctions.validateMainTitle()
            apiRequests.interceptUpdateTask()
            tasksFunctions.openEditFormOnLastTask()
            tasksFunctions.editTask()
            tasksFunctions.grabTaskValues().then(() => {
                tasksFunctions.fillManualTaskEditForm(tasks.edited)
                tasksFunctions.grabTaskValues().then((newTask: any) => {
                    tasksFunctions.saveEditTask()
                    apiRequests.waitForTaskEditAndGetId()
                    tasksFunctions.validateCardValues(newTask)
                    apiRequests.validateTaskInDB(newTask)
                })
            })
        })
    })
    it('Should search and toggle completion status of last task and validate the update', () => {
        tasksFunctions.appEntrance()
        tasksFunctions.validateMainTitle()
        apiRequests.interceptUpdateTask()
        tasksFunctions.openEditFormOnLastTask()
        tasksFunctions.SearchTaskByTitle()
        cy.wait(times.waitToLoad);
        tasksFunctions.toggleCompletionOnFoundTask();
        apiRequests.waitForTaskEditAndGetId();
        tasksFunctions.validateToggleChangedStatus();
        apiRequests.validateCompletedTask()
    })
    it('Should delete the last task after the completion', () => {
        tasksFunctions.appEntrance()
        tasksFunctions.validateMainTitle()
        apiRequests.interceptDeleteTask()
        tasksFunctions.openEditFormOnLastTask()
        tasksFunctions.SearchTaskByTitle()
        cy.wait(times.waitToLoad)
        tasksFunctions.deleteTask()
        apiRequests.waitForTaskDeleteAndGetId()
        apiRequests.validateDeletedTask()
    })
})


