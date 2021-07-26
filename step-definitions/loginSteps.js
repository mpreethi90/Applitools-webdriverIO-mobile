// import { Given, When, Then } from "cucumber";
const Given = require('cucumber').Given;

let sleep  = require("sleep");
Given(/^I launch consumer app$/, { timeout: 500000 }, () => {
    $('~button-login-container').waitForDisplayed({ timeout: 5000 });
});


