import { tasksSelectors } from "../mapping/tasksMapping";
import { TaskData } from "../mapping/constants/task.types";

class TasksFunctions {
    
    // כניסה לאפליקציה
    appEntrance(): void {
        cy.visit('/');
    }

    // ולידציה על כותרת ראשית
    validateMainTitle(): void {
        cy.get(tasksSelectors.mainTitle).should('exist').and('be.visible');
    }

    // וידוא שטופס ה-AI התמלא בצורה אוטומטית (ולא ריק)
    fillAiTaskForm(): void {
        const form = tasksSelectors.form;
        cy.get(form.categorySelector).invoke('val').should('not.be.empty');
        cy.get(form.taskTitle).invoke('val').should('not.be.empty');
        cy.get(form.taskDescription).invoke('val').should('not.be.empty');
        cy.get(form.taskDate).invoke('val').should('not.be.empty');
    }

    // משיכת ערכים מהטופס (ללא פירמידות then)
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

    // שליחת הטופס
    submitCreateForm(): void {
        cy.get(tasksSelectors.form.createTaskButton).click();
    }

    // משיכת ערכים ממסך העריכה - הפיכת השרשרת למבנה שטוח וקריא בטירוף
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

    // שמירת שינויי עריכה
    saveEditTask(): void {
        cy.get(tasksSelectors.tasksListContainer.taskItemEditScreen.saveEditButton).click();
    }

    // ולידציה של כרטיס המשימה ב-UI (קוד נקי, ממוקד ונטול רעש בתוך ה-within)
    validateCardValues(task: TaskData): void {
        const details = tasksSelectors.tasksListContainer.taskDetails;

        cy.get(tasksSelectors.tasksListContainer.taskItem)
            .last()
            .should('be.visible')
            .within(() => {
                // ולידציית כותרת וסטטוס ביצוע
                cy.get(details.taskItemTitle)
                    .should('not.be.empty')
                    .invoke('text')
                    .then((text) => {
                        const expectedText = `${task.title} (${task.category}) - ${task.completed ? '✅' : '❌'}`;
                        expect(text.trim()).to.eq(expectedText);
                    });

                // ולידציית תיאור
                cy.get(details.taskItemDescrition)
                    .should('not.be.empty')
                    .invoke('text')
                    .then((text) => expect(text.trim()).to.eq(task.description));

                // ולידציית תאריך
                cy.get(details.taskItemDate)
                    .should('not.be.empty')
                    .invoke('text')
                    .then((text) => expect(text.trim()).to.eq(task.date));
            });
    }

    // בחירת אינדקס רנדומלי מהמערך
    private getRandomIndexNumber(): number {
        return Math.floor(Math.random() * 4);
    }

    // חיפוש משימה לפי כותרת מתוך האליאס השמור של הטאסק האחרון
    searchTaskByTitle(): void {
        const titleDetails = tasksSelectors.tasksListContainer.taskDetails.taskItemTitle;
        
        cy.get('@lastTask').find(titleDetails).invoke('text').then((fullText) => {
            const title = fullText.trim().split(' (')[0];
            cy.get(tasksSelectors.searchTasksBar).clear().type(title);
        });
    }

    // הגדרת המשימה האחרונה כאליאס לשימוש בהמשך הטסט
    openEditFormOnLastTask(): void {
        cy.get(tasksSelectors.tasksListContainer.taskItem).last().as('lastTask');
    }

    // לחיצה על כפתור עריכה
    editTask(): void {
        cy.get('@lastTask').find(tasksSelectors.tasksListContainer.taskItemButtons.editButton).click();
    }
    
    // שינוי סטטוס ביצוע (Complete/Uncomplete)
    toggleCompletionOnFoundTask(): void {
        cy.get(tasksSelectors.tasksListContainer.taskItem).last().as('foundTask');
        cy.get('@foundTask').find(tasksSelectors.tasksListContainer.taskItemButtons.toggleButton).click();
    }

    // וידוא שהסטטוס השתנה לוי ירוק
    validateToggleChangedStatus(): void {            
        cy.get('@foundTask').find(tasksSelectors.tasksListContainer.taskDetails.taskItemTitle)
            .invoke('text')
            .should('contain', '✅'); // שימוש במוצרים המובנים של סייפרס במקום expect ידני
    }

    // מחיקת משימה
    deleteTask(): void {
        cy.get(tasksSelectors.tasksListContainer.taskItem)
            .last()
            .find(tasksSelectors.tasksListContainer.taskItemButtons.deleteButton)
            .click();
    }    

    // מילוי ידני של טופס יצירה (בטוח ומבוסס טיפוסים)
    fillManualTaskForm(tasks: TaskData[]): void {
        const form = tasksSelectors.form;
        const idx = this.getRandomIndexNumber();
        
        cy.get(form.categorySelector).select(tasks[idx].category);
        cy.get(form.taskTitle).clear().type(tasks[idx].title);
        cy.get(form.taskDescription).clear().type(tasks[idx].description);
        cy.get(form.taskDate).clear().type(tasks[idx].date);
    }

    // מילוי ידני של טופס עריכה
    fillManualTaskEditForm(tasks: TaskData[]): void {
        const screen = tasksSelectors.tasksListContainer.taskItemEditScreen;
        const idx = this.getRandomIndexNumber();
        
        cy.get(screen.taskInputEditCategory).select(tasks[idx].category);
        cy.get(screen.taskInputEditTitle).clear().type(tasks[idx].title);
        cy.get(screen.taskInputEditDescription).clear().type(tasks[idx].description);
        cy.get(screen.taskInputEditDate).clear().type(tasks[idx].date);
    }
}

export default new TasksFunctions();