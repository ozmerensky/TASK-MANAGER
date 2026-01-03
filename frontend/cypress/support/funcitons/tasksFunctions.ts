import { tasksSelectors } from "../mapping/tasksMapping";
import { TaskInput } from "../mapping/constants/task.types";
import { TaskSource } from "../mapping/constants/task.types";
import { times } from "../mapping/constants/times";

class tasksFunctions {
    appEntrance(){
        cy.visit('/')
    }
    validateMainTitle(){
        cy.get(tasksSelectors.mainTitle).should('exist').and('be.visible')
    }

    fillAiTaskForm(){
        cy.get(tasksSelectors.form.categorySelector).invoke('val').should('not.be.empty');
        cy.get(tasksSelectors.form.taskTitle).invoke('val').should('not.be.empty');
        cy.get(tasksSelectors.form.taskDescription).invoke('val').should('not.be.empty');
        cy.get(tasksSelectors.form.taskDate).invoke('val').should('not.be.empty');
    }

    grabFormValues() {
        const task: { title: string; category: string; description: string; date: string } = {
            title: '',
            category: '',
            description: '',
            date: '',
        };
        
        cy.get(tasksSelectors.form.taskTitle).invoke('val').then(val => (task.title = val as string));
        cy.get(tasksSelectors.form.categorySelector).invoke('val').then(val => (task.category = val as string));
        cy.get(tasksSelectors.form.taskDescription).invoke('val').then(val => (task.description = val as string));
        cy.get(tasksSelectors.form.taskDate).invoke('val').then(val => (task.date = val as string));
        
        return cy.wrap(task); 
    }

    submitCreateForm(){
        cy.get(tasksSelectors.form.createTaskButton).click()
    }

    grabTaskValues() {
        const task: { title: string; category: string; description: string; date: string } = {
            title: '',
            category: '',
            description: '',
            date: '',
        };
        return cy
            .get(tasksSelectors.tasksListContainer.taskItemEditScreen.taskInputEditTitle)
            .invoke('val')
            .then((val) => {
                task.title = val as string;
                return cy.get(tasksSelectors.tasksListContainer.taskItemEditScreen.taskInputEditCategory).invoke('val');
            })
            .then((val) => {
                task.category = val as string;
                return cy.get(tasksSelectors.tasksListContainer.taskItemEditScreen.taskInputEditDescription).invoke('val');
            })
            .then((val) => {
                task.description = val as string;
                return cy.get(tasksSelectors.tasksListContainer.taskItemEditScreen.taskInputEditDate).invoke('val');
            })
            .then((val) => {
                task.date = val as string;
                cy.log(`title: ${task.title}`, `category: ${task.category}`, `description: ${task.description}`, `date: ${task.date}`);
                return cy.wrap(task);
            });
    }

    saveEditTask(){
        cy.get(tasksSelectors.tasksListContainer.taskItemEditScreen.saveEditButton).click()
    }

    validateCardValues(task: { title: string; category: string; description: string; date: string, completed?: string }) {
        cy.get(tasksSelectors.tasksListContainer.taskItem)
            .last()
            .should('be.visible')
            .within(() => {
                cy.get(tasksSelectors.tasksListContainer.taskDetails.taskItemTitle)
                    .should('not.be.empty')
                    .invoke('text')
                    .then((text) => {
                        const cleanText = text.trim();
                        const expectedText = `${task.title} (${task.category}) - ${task.completed ? '✅' : '❌'}`;
                        expect(cleanText).to.eq(expectedText);
                    });

                cy.get(tasksSelectors.tasksListContainer.taskDetails.taskItemDescrition)
                    .should('not.be.empty')
                    .invoke('text')
                    .then((text) => {
                        expect(text.trim()).to.eq(task.description);
                    });

                cy.get(tasksSelectors.tasksListContainer.taskDetails.taskItemDate)
                    .should('not.be.empty')
                    .invoke('text')
                    .then((text) => {
                        expect(text.trim()).to.eq(task.date);
                    });
            });
    }

       
    getRandomIndexNumber() {
        return Math.floor(Math.random() * 4)
    }

    SearchTaskByTitle(){
        cy.get('@lastTask').find(tasksSelectors.tasksListContainer.taskDetails.taskItemTitle).invoke('text').then((fullText) => {
            const title = fullText.trim().split(' (')[0];

            cy.get(tasksSelectors.searchTasksBar).clear().type(title);
        });
    }

    openEditFormOnLastTask(){
        cy.get(tasksSelectors.tasksListContainer.taskItem).last().as('lastTask');
    }

    editTask(){
        cy.get('@lastTask').find(tasksSelectors.tasksListContainer.taskItemButtons.editButton).click();
    }
    
    toggleCompletionOnFoundTask(){
        cy.get(tasksSelectors.tasksListContainer.taskItem).last().as('foundTask');
        cy.get('@foundTask').find(tasksSelectors.tasksListContainer.taskItemButtons.toggleButton).click();
    }
    validateToggleChangedStatus(){            
        cy.get('@foundTask').find(tasksSelectors.tasksListContainer.taskDetails.taskItemTitle).invoke('text').then((updatedText) => {
            expect(updatedText).to.contain('✅');
        });
    }
    deleteTask(){
        cy.get(tasksSelectors.tasksListContainer.taskItem)
        .last()
        .find(tasksSelectors.tasksListContainer.taskItemButtons.deleteButton)
        .click()
    }    

    fillManualTaskForm(tasks: any){
        const idx = this.getRandomIndexNumber()
        cy.get(tasksSelectors.form.categorySelector).select(tasks[idx].category)
        cy.get(tasksSelectors.form.taskTitle).clear().type(tasks[idx].title)
        cy.get(tasksSelectors.form.taskDescription).clear().type(tasks[idx].description)
        cy.get(tasksSelectors.form.taskDate).clear().type(tasks[idx].date)
    }

    fillManualTaskEditForm(tasks: any){
        const idx = this.getRandomIndexNumber()
        cy.get(tasksSelectors.tasksListContainer.taskItemEditScreen.taskInputEditCategory).select(tasks[idx].category)
        cy.get(tasksSelectors.tasksListContainer.taskItemEditScreen.taskInputEditTitle).clear().type(tasks[idx].title)
        cy.get(tasksSelectors.tasksListContainer.taskItemEditScreen.taskInputEditDescription).clear().type(tasks[idx].description)
        cy.get(tasksSelectors.tasksListContainer.taskItemEditScreen.taskInputEditDate).clear().type(tasks[idx].date)
    }
}

export default new tasksFunctions()