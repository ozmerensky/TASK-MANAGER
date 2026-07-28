import { tasksSelectors } from "../mapping/tasksMapping";
import { TaskData } from "../mapping/constants/task.types";

class TasksFunctions {

    appEntrance(): void {
        cy.visit('/');
    }

    validateMainTitle(): void {
        cy.get(tasksSelectors.mainTitle).should('exist').and('be.visible');
    }

    fillAiTaskForm(): void {
        const form = tasksSelectors.form;
        cy.get(form.categorySelector).should('be.visible').and(($select) => {
            expect($select.val()).to.not.be.empty;
        });
        cy.get(form.taskTitle).should('be.visible').and(($input) => {
            expect($input.val()).to.not.be.empty;
        });
        cy.get(form.taskDescription).should('be.visible').and(($input) => {
            expect($input.val()).to.not.be.empty;
        });
        cy.get(form.taskDate).should('be.visible').and(($input) => {
            expect($input.val()).to.not.be.empty;
        });
    }

    grabFormValues(): Cypress.Chainable<TaskData> {
        const form = tasksSelectors.form;
        const task: TaskData = { title: '', category: '', description: '', date: '' };

        return cy.get(form.taskTitle).invoke('val').then((title) => {
            task.title = title as string;
            return cy.get(form.categorySelector).invoke('val');
        }).then((category) => {
            task.category = category as string;
            return cy.get(form.taskDescription).invoke('val');
        }).then((desc) => {
            task.description = desc as string;
            return cy.get(form.taskDate).invoke('val');
        }).then((date) => {
            task.date = date as string;
            return cy.wrap(task);
        });
    }

    submitCreateForm(): void {
        cy.get(tasksSelectors.form.createTaskButton).should('be.visible').click();
    }

    grabTaskValues(): Cypress.Chainable<TaskData> {
        const screen = tasksSelectors.tasksListContainer.taskItemEditScreen;
        const task: TaskData = { title: '', category: '', description: '', date: '' };

        return cy.get(screen.taskInputEditTitle).invoke('val').then((val) => {
            task.title = val as string;
            return cy.get(screen.taskInputEditCategory).invoke('val');
        }).then((val) => {
            task.category = val as string;
            return cy.get(screen.taskInputEditDescription).invoke('val');
        }).then((val) => {
            task.description = val as string;
            return cy.get(screen.taskInputEditDate).invoke('val');
        }).then((val) => {
            task.date = val as string;
            cy.log(`Grabbed Values -> Title: ${task.title}, Category: ${task.category}`);
            return cy.wrap(task);
        });
    }

    saveEditTask(): void {
        cy.get(tasksSelectors.tasksListContainer.taskItemEditScreen.saveEditButton).should('be.visible').click();
    }

    validateCardValues(task: TaskData): void {
        const details = tasksSelectors.tasksListContainer.taskDetails;

        cy.get(tasksSelectors.tasksListContainer.taskItem)
            .last()
            .should('be.visible')
            .within(() => {
                cy.get(details.taskItemTitle)
                    .should('not.be.empty')
                    .invoke('text')
                    .then((text) => {
                        const expectedText = `${task.title} (${task.category}) - ${task.completed ? '✅' : '❌'}`;
                        expect(text.trim()).to.eq(expectedText);
                    });

                cy.get(details.taskItemDescrition)
                    .should('not.be.empty')
                    .invoke('text')
                    .then((text) => expect(text.trim()).to.eq(task.description));

                cy.get(details.taskItemDate)
                    .should('not.be.empty')
                    .invoke('text')
                    .then((text) => expect(text.trim()).to.eq(task.date));
            });
    }

    private getRandomIndexNumber(): number {
        return Math.floor(Math.random() * 4);
    }

    searchTaskByTitle(): void {
        const titleDetails = tasksSelectors.tasksListContainer.taskDetails.taskItemTitle;
        
        cy.get('@lastTask').find(titleDetails).invoke('text').then((fullText) => {
            const title = fullText.trim().split(' (')[0];
            cy.get(tasksSelectors.searchTasksBar).clear().type(title);
        });
    }

    openEditFormOnLastTask(): void {
        cy.get(tasksSelectors.tasksListContainer.taskItem)
        .should('have.length.at.least', 1)
        .last()
        .should('be.visible')
        .as('lastTask');
    }

    editTask(): void {
        cy.get('@lastTask').find(tasksSelectors.tasksListContainer.taskItemButtons.editButton).should('be.visible').click();
    }
    
    toggleCompletionOnFoundTask(): void {
        cy.get(tasksSelectors.tasksListContainer.taskItem).should('have.length.at.least', 1).last().as('foundTask');
        cy.get('@foundTask').find(tasksSelectors.tasksListContainer.taskItemButtons.toggleButton).should('be.visible').click();
    }

    validateToggleChangedStatus(): void {            
        cy.get('@foundTask').find(tasksSelectors.tasksListContainer.taskDetails.taskItemTitle)
            .invoke('text')
            .should('contain', '✅');
    }

    deleteTask(): void {
        cy.get(tasksSelectors.tasksListContainer.taskItem)
            .should('have.length.at.least', 1)
            .last()
            .find(tasksSelectors.tasksListContainer.taskItemButtons.deleteButton)
            .should('be.visible')
            .click();
    }    

    fillManualTaskForm(tasks: TaskData[]): void {
        const form = tasksSelectors.form;
        const idx = this.getRandomIndexNumber();
        
        cy.get(form.categorySelector).should('be.visible').select(tasks[idx].category);
        cy.get(form.taskTitle).should('be.visible').clear().type(tasks[idx].title);
        cy.get(form.taskDescription).should('be.visible').clear().type(tasks[idx].description);
        cy.get(form.taskDate).should('be.visible').clear().type(tasks[idx].date);
    }

    fillManualTaskEditForm(tasks: TaskData[]): void {
        const screen = tasksSelectors.tasksListContainer.taskItemEditScreen;
        const idx = this.getRandomIndexNumber();
        
        cy.get(screen.taskInputEditCategory).should('be.visible').select(tasks[idx].category);
        cy.get(screen.taskInputEditTitle).should('be.visible').clear().type(tasks[idx].title);
        cy.get(screen.taskInputEditDescription).should('be.visible').clear().type(tasks[idx].description);
        cy.get(screen.taskInputEditDate).should('be.visible').clear().type(tasks[idx].date);
    }
}

export default new TasksFunctions();