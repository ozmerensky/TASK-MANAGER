import { times } from "../mapping/constants/times";
import { tasksSelectors } from "../mapping/tasksMapping";
import tasksFunctions from "./tasksFunctions";

class aiFunctions{
    generateAiTask(){
        cy.get(tasksSelectors.aiButton).click()
    }

    suggestAiEditTask(){
        cy.get(tasksSelectors.tasksListContainer.taskItemEditScreen.suggestAiEditButton).click();
    }

    suggestAiEditAndVerifyChange(previousTask?: { title: string; category: string; description: string; date: string }) {
        const compareAndAssert = (
            oldTask: { title: string; category: string; description: string; date: string },
            attemptsLeft = 3
        ): Cypress.Chainable<any> => {
            cy.log(`Attempting AI suggestion, attempts left: ${attemptsLeft}`);
            this.suggestAiEditTask();
            cy.wait(times.waitToDataCheck);

            return tasksFunctions.grabTaskValues().then((newTask: any) => {
                const nt = newTask as { title: string; category: string; description: string; date: string };
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
                    cy.log('No field changed, retrying AI suggestion...');
                    cy.wait(times.waitToLoad);
                    return compareAndAssert(oldTask, attemptsLeft - 1);
                }

                expect(somethingChanged, 'AI should change at least one field after retries').to.be.true;
                return cy.wrap(nt);
            });
        };

        if (previousTask) {
            cy.wait(times.waitToDataCheck);
            return compareAndAssert(previousTask as any);
        }

        return tasksFunctions.grabTaskValues().then((oldTask: any) => {
            cy.wait(times.waitToLoad);
            return compareAndAssert(oldTask as { title: string; category: string; description: string; date: string });
        });
    }

}
export default new aiFunctions()