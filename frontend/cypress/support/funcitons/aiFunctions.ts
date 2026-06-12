import { tasksSelectors } from "../mapping/tasksMapping";
import tasksFunctions from "./tasksFunctions";
import { TaskData } from "../mapping/constants/task.types";

class AiFunctions {
    
    generateAiTask(): void {
        cy.get(tasksSelectors.aiButton).click();
    }

    suggestAiEditTask(): void {
        cy.get(tasksSelectors.tasksListContainer.taskItemEditScreen.suggestAiEditButton).click();
    }

    suggestAiEditAndVerifyChange(previousTask?: TaskData): Cypress.Chainable<TaskData> {
        const compareAndAssert = (oldTask: TaskData, attemptsLeft = 3): Cypress.Chainable<TaskData> => {
            cy.log(`Attempting AI suggestion, attempts left: ${attemptsLeft}`);
            this.suggestAiEditTask();

            return tasksFunctions.grabTaskValues().then((newTask: unknown) => {
                const nt = newTask as TaskData;
                
                const somethingChanged = 
                    nt.title !== oldTask.title ||
                    nt.category !== oldTask.category ||
                    nt.description !== oldTask.description ||
                    nt.date !== oldTask.date;

                if (somethingChanged) {
                    cy.log('✅ AI edit suggestion changed at least one field');
                    return cy.wrap(nt);
                }

                if (attemptsLeft > 1) {
                    cy.log('⚠️ No field changed, retrying AI suggestion...');
                    return compareAndAssert(oldTask, attemptsLeft - 1);
                }

                expect(somethingChanged, 'AI should change at least one field after retries').to.be.true;
                return cy.wrap(nt);
            });
        };

        if (previousTask) {
            return compareAndAssert(previousTask);
        }

        return tasksFunctions.grabTaskValues().then((oldTask: unknown) => {
            return compareAndAssert(oldTask as TaskData);
        });
    }
}

export default new AiFunctions();