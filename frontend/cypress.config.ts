import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173/',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**.cy.ts',
    defaultCommandTimeout: 15000,
    retries: {
      runMode: 3,
      openMode: 1
    },
    video: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  
  
});
