import tasksFunctions from "../support/funcitons/tasksFunctions"
import aiFunctions from "../support/funcitons/aiFunctions"
import apiRequests from "../support/funcitons/apiFunctions/apiRequests"
import { times } from "../support/mapping/constants/times"

describe('AI Task Flow', () => {
    it('Should generate AI task and create card with the same data', () => {
        tasksFunctions.appEntrance()
        tasksFunctions.validateMainTitle()
        aiFunctions.generateAiTask()
        apiRequests.interceptCreateTask()
        cy.wait(times.waitToLoad)
        tasksFunctions.grabFormValues().then((task) => {
            tasksFunctions.submitCreateForm()
            apiRequests.waitForTaskCreationAndGetId()
            tasksFunctions.validateCardValues(task)
            apiRequests.validateTaskInDB(task)
        })
    })
    it('Should edit last task via AI suggestion and validate the update', () => {
        tasksFunctions.appEntrance()
        tasksFunctions.validateMainTitle()
        apiRequests.interceptUpdateTask()
        tasksFunctions.openEditFormOnLastTask()
        tasksFunctions.editTask()
        tasksFunctions.grabTaskValues().then((previousTask: any) => {
            aiFunctions.suggestAiEditAndVerifyChange(previousTask as { title: string; category: string; description: string; date: string }).then((newTask: any) => {
                tasksFunctions.saveEditTask()
                apiRequests.waitForTaskEditAndGetId()
                tasksFunctions.validateCardValues(newTask)
                apiRequests.validateTaskInDB(newTask)
            })
        })
    })
    it('Should search and toggle completion status of last task via AI suggestion and validate the update', () => {
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
    it('Should delete the last task via AI after the completion', () => {
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
