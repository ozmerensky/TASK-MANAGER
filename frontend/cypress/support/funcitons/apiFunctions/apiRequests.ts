import { TaskData } from "../../mapping/constants/task.types";

class ApiRequests {
    private currentTaskId: string | null = null;
    private baseUrl = 'http://localhost:5000/tasks';

    private getTaskDetails(taskId: string) {
        return cy.request({
            method: 'GET',
            url: `${this.baseUrl}/${taskId}/details`,
            failOnStatusCode: false
        });
    }

    createRandomTaskFromArray(taskArray: TaskData[]) {
        this.currentTaskId = null;
        const randomTask = taskArray[Math.floor(Math.random() * taskArray.length)];
        
        return cy.request('POST', `${this.baseUrl}/create`, randomTask).then((response) => {
            expect(response.status, 'API Seeding creation status').to.eq(201);
            expect(response.body).to.have.property('_id');
            
            this.currentTaskId = response.body._id;

            cy.wrap(this.currentTaskId).as('taskId');
            cy.wrap(randomTask).as('createdTaskData');
        });
    }

    interceptCreateTask() {
        cy.intercept('POST', '/tasks/create').as('createTask');
    }

    interceptUpdateTask() {
        cy.intercept('PUT', '/tasks/*/update').as('updateTask');
    }

    interceptDeleteTask() {
        cy.intercept('DELETE', '/tasks/*/delete').as('deleteTask');
    }

    waitForTaskCreationAndGetId() {
        return cy.wait('@createTask', { timeout: 10000 }).then((interception) => {
            const status = interception.response?.statusCode;
            expect(status, 'Task creation network status').to.eq(201);
            
            this.currentTaskId = interception.response?.body?._id;
            expect(this.currentTaskId, 'Intercepted response body should contain _id').to.be.a('string');
        });
    }

    waitForTaskEditAndGetId() {
        return cy.wait('@updateTask', { timeout: 10000 }).then((interception) => {
            expect(interception.response?.statusCode, 'Task update network status').to.eq(200);
            this.currentTaskId = interception.response?.body?._id;
        });
    }


    waitForTaskDeleteAndGetId() {
        return cy.wait('@deleteTask', { timeout: 10000 }).then((interception) => {
            const deletedBody = interception.response?.body;
            
            if (deletedBody?._id) {
                this.currentTaskId = deletedBody._id;
                return;
            }

            const url = interception.request?.url || '';
            const match = url.match(/\/tasks\/([^\/]+)\/delete/);
            
            expect(match && match[1], 'Could not extract deleted task ID from intercept URL/body').to.not.be.null;
            
            if (match && match[1]) {
                this.currentTaskId = match[1];
            }
        });
    }

    validateTaskInDB(expectedTask: TaskData) {
        if (!this.currentTaskId) throw new Error('No currentTaskId found for validation');

        this.getTaskDetails(this.currentTaskId).then((response) => {
            expect(response.status, 'DB Validation GET status').to.eq(200);
            
            const dbTask = response.body;
            expect(dbTask).to.have.property('title', expectedTask.title);
            expect(dbTask).to.have.property('category', expectedTask.category);
            expect(dbTask).to.have.property('description', expectedTask.description);
            expect(dbTask).to.have.property('date', expectedTask.date);
            expect(dbTask).to.have.property('completed', false);
        });
    }

    validateCompletedTask() {
        if (!this.currentTaskId) throw new Error('No currentTaskId found for completion validation');

        this.getTaskDetails(this.currentTaskId).then((response) => {
            expect(response.status, 'DB Completion Validation GET status').to.eq(200);
            expect(response.body).to.have.property('completed', true);
        });
    }

    validateDeletedTask() {
        if (!this.currentTaskId) throw new Error('No currentTaskId found for deletion validation');

        this.getTaskDetails(this.currentTaskId).then((response) => {
            expect(response.status, 'Expected task to be missing from DB (404)').to.eq(404);
        });
    }

    cleanupCurrentTask() {
        if (!this.currentTaskId) return;

        const idToDelete = this.currentTaskId;
        this.currentTaskId = null;

        cy.request({
            method: 'DELETE',
            url: `${this.baseUrl}/${idToDelete}/delete`,
            failOnStatusCode: false
        });
    }
}

export default new ApiRequests();