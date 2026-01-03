import { times } from "../../mapping/constants/times";

class apiRequests{
    interceptCreateTask(){
        cy.intercept('POST', '/tasks/create').as('createTask')
    }
    waitForTaskCreationAndGetId(){
        cy.wait('@createTask').then((interception) => {
            const status = interception.response?.statusCode;
            const createdTask = interception.response?.body
            if (status !== 201){
                throw new Error(`Task creation failed! status code: ${status}`)
            }
            cy.log('Task created succefully with status 201')
            expect(createdTask).to.have.property('_id')
            cy.wrap(createdTask._id).as('createdTaskId')
        })
        cy.wait(times.afterCardCreation)
    }
    validateTaskInDB(uiTask: { title: string; category: string; description: string; date: string }) {
        cy.get('@createdTaskId').then((taskId) => {
            if (!taskId) throw new Error('No createdTaskId alias found when validating task in DB')
            cy.request({
                method: 'GET',
                url: `http://localhost:5000/tasks/${taskId}/details`,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status, `GET /tasks/${taskId}/details returned`).to.eq(200);

                const dbTask = response.body;

                expect(dbTask).to.have.property('title', uiTask.title);
                expect(dbTask).to.have.property('category', uiTask.category);
                expect(dbTask).to.have.property('description', uiTask.description);
                expect(dbTask).to.have.property('date', uiTask.date);
                expect(dbTask).to.have.property('completed', false);
            });
        });
    }

    interceptUpdateTask(){
        cy.intercept('PUT', '/tasks/*/update').as('updateTask')
    }

    waitForTaskEditAndGetId(){
        cy.wait('@updateTask').then((interception) => {
            const status = interception.response?.statusCode;
            const createdTask = interception.response?.body
            if (status !== 200){
                throw new Error(`Task edit failed! status code: ${status}`)
            }
            cy.log('Task edited succefully with status 200')
            expect(createdTask).to.have.property('_id')
            cy.wrap(createdTask._id).as('createdTaskId')
        })
        cy.wait(times.afterCardCreation)
    }
    validateCompletedTask(){
        cy.get('@createdTaskId').then((taskId) => {
            if (!taskId) throw new Error('No createdTaskId alias found when validating completed task')
            cy.request({
                method: 'GET',
                url: `http://localhost:5000/tasks/${taskId}/details`,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status, `GET /tasks/${taskId}/details returned`).to.eq(200);
                expect(response.body).to.have.property('completed', true);
            });
        });
    }

    interceptDeleteTask(){
        cy.intercept('DELETE', '/tasks/*/delete').as('deleteTask')
    }

    waitForTaskDeleteAndGetId(){
        cy.wait('@deleteTask').then((interception) => {
            const deletedBody = interception.response?.body;
            if (deletedBody && deletedBody._id) {
                cy.wrap(deletedBody._id).as('deletedTaskId')
                return
            }

            const url = interception.request?.url || ''
            const m = url.match(/\/tasks\/([^\/]+)\/delete/)
            if (m && m[1]) {
                cy.wrap(m[1]).as('deletedTaskId')
                return
            }

            throw new Error('Could not determine deleted task id from delete intercept')
        })
    }

    validateDeletedTask(){
        cy.get('@deletedTaskId').then((id) => {
            if (!id) throw new Error('No deletedTaskId alias found when validating deletion')
            cy.request({
                method: 'GET',
                url: `http://localhost:5000/tasks/${id}/details`,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status, `Expected task ${id} to be deleted`).to.eq(404)
            })
        })
    }
}

export default new apiRequests()