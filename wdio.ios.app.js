/**
 * WebdriverIO config file to run tests on native mobile apps.
 * Config file helps us configure all the settings and setup environments
 * to run our tests.
 */
 require("chai/register-assert");
 const merge = require("deepmerge");
 const wdioMobileConf = require("./wdio.shared.conf.js");
  const customCapabilities = merge(wdioMobileConf.mobCapabilities, {
     platformName: "iOS",
     app: './apps/wdioNativeDemoApp.app',
     waitforTimeout: 300,
     automationName: "XCUITest",
     noReset: true,
     locationServicesEnabled: true,
     locationServicesAuthorized: true,
     recordLogs: false,
     recordScreenshots: false,
 });
 const capabilities = [];
 capabilities.push(customCapabilities);
 const featurePath = `./test/specs/${process.env.FEATUREFILE ? process.env.FEATUREFILE : "**"}`;
 const specs = wdioMobileConf.featureFilesWithTags(featurePath, process.env.TAGS);

 
 exports.config = merge(wdioMobileConf.config, {
     specs: specs,
     path: "/wd/hub",
     capabilities: capabilities,
     onPrepare: async function () {
         console.log("<<< NATIVE APP TESTS STARTED >>>");
     },
 });
 