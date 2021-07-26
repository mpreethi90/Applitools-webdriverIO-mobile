/**
 * This is the base mobile config file including all the
 * common configurations for webdriverio, appium, cucumber
 */
 const glob = require("glob");
 const fs = require("fs");
 const path = require("path");
 const { Status } = require("cucumber");
 const { TagExpressionParser } = require("cucumber-tag-expressions");
 const fse = require("fs-extra");
 const allureReporter = require("@wdio/allure-reporter");
 const crypto = require("crypto");
 const iosCmd = require("ios-automation-helper");
 
 const host = "127.0.0.1"; // default appium host
 const waitforTimeout = 2 * 60000;
 
 const tagParser = new TagExpressionParser();
 const stepsFolder = "./step-definitions";

 const steps = [];
 const config = require("./config.js");
 

 const {
    Configuration,
    Eyes,
    Target,
    ClassicRunner,
    ConsoleLogHandler,
    RunnerOptions,
    BatchInfo
  } = require('@applitools/eyes-webdriverio');
  const runnerOptions = new RunnerOptions().testConcurrency(5);
    
let runner = new ClassicRunner(runnerOptions);

  let eyes = new Eyes(runner);
  let configuration = eyes.getConfiguration();;


configuration.setBatch(new BatchInfo('Classic Batch'))
configuration.setApiKey("Q74566t4hUBqYCmWLDdgf7qsh19fy9RpM0uyVR0OAmk110")
configuration.setAppName("checkApp");
configuration.setTestName("checkTest");
eyes.setConfiguration(configuration);



 fs.readdirSync(stepsFolder).forEach((file) => {
     if (!/^\..*/.test(file)) {
         const step = stepsFolder + "/" + file;
         steps.push(step);
     }
 });
 
 const featureFilesWithTags = (featuresPath, cucumberTags) => {
     const expressionNode = tagParser.parse(cucumberTags);
     // when have folders inside the feature file, need to put nodir: true
     const featureFilesHaveTags = glob.sync(featuresPath, { nodir: true }).filter((featureFile) => {
         const content = fs.readFileSync(path.resolve(__dirname, featureFile), "utf8");
         if (content.length > 0) {
             const regex = new RegExp("@\\w+_SG", "g");
             const tagsInFile = content.match(regex) || [];
             if (expressionNode.evaluate(tagsInFile)) {
                 return true;
             }
         }
 
         return false;
     });
 
     return featureFilesHaveTags;
 };
 
 async function createDir(directory) {
     try {
         await fse.ensureDir(directory);
         console.log(directory, "created successfully!");
     } catch (err) {
         console.error(err);
     }
 }
 
 async function removeFolder(folderName) {
     try {
         await fse.remove(folderName);
         console.log(folderName, "deleted successfully!");
     } catch (err) {
         console.error(err);
     }
 }
 

 
 let customConfig = config.localConfig

 const mobCapabilities =
     {
         unicodeKeyboard: true,
         resetKeyboard: true,
         browserName: "",
         deviceName: process.env.DEVICE_NAME,
         platformVersion: process.env.DEVICE_VERSION,
         build: process.env.BUILDTAG,
     };
 
 customConfig = Object.assign(customConfig, {
     debug: false,
     bail: 0,
     reporters: ["spec", 
     ["allure", {
         outputDir: "./_results_/allure-raw",
         disableWebdriverStepsReporting: true,
         disableWebdriverScreenshotsReporting: true,
         useCucumberStepReporter: true,
         tmsLinkTemplate: "https://app.saucelabs.com/tests/{}",
     }]],
     connectionRetryTimeout: 90000,
     connectionRetryCount: 1,
 
     nativeAppCompare: {
         baselineFolder: "./resources/vrt/image-baseline",
         screenshotPath: "./resources/vrt/image-compare",
         autoSaveBaseline: true,
         blockOutStatusBar: true,
         blockOutNavigationBar: true,
         blockOutIphoneXBottomBar: true,
         imageNameFormat: "{tag}-{deviceName}-{platformVersion}",
         savePerDevice: true,
     },
 
     /**
      * test configurations
      */
     logLevel: "debug",
     coloredLogs: true,
     framework: "cucumber", // cucumber framework specified
     cucumberOpts: {
         requireModule: ["@babel/register"],
         backtrace: true,
         failFast: false,
         colors: true,
         timeout: 7 * 60000,
         require: steps,
         tags: [],
         tagExpression: process.env.TAGS,
         ignoreUndefinedDefinitions: true
     },
 
     /**
      * hooks help us execute the repeatitive and common utilities
      * of the project.
      */
     onPrepare: async function () {
         console.log("<<< NATIVE APP TESTS STARTED >>>");
         await removeFolder("./_results_");
     },
 
     beforeSession: async function (config, capabilities, specs) {
         const testName = specs[0].split("/");
         capabilities.name = testName[testName.length - 1];
     },
 
    //  afterScenario: async function () {
    //      if (typeof process.env.IsCloud !== "undefined") {
    //          const auth = crypto.createHmac("md5", `${config.saucelabConfig.user}:${config.saucelabConfig.key}`).update(browser.sessionId).digest("hex");
    //          allureReporter.default.addTestId(browser.sessionId + `?auth=${auth}`);
    //      }
    //  },
 
     afterFeature: function () {
         if (config.platform === "ios") {
             browser.execute("mobile: clearKeychains ");
         }
     },

     after: async function () {
         console.log("**************** Session ID ****************");
         console.log(browser.sessionId);
         console.log("**************** Session ID ****************");
     },
     beforeScenario: async function (uri, feature, scenario, sourceLocation) {
         console.log("**************** Scenario started ****************");
         console.log(scenario.name);
         console.log("***************************************************");
        // using webdriverio6
         browser.takeSnapshot('homeScreen');
        //using @applitools/eyes-webdriverio
        eyes.open(browser, "Contacts", "My first Appium native JS test!");
        eyes.check('Login Window', Target.window());
        eyes.close();
     },
     onComplete: function () {
         console.log("<<< TESTING FINISHED >>>");
     },
     afterStep(scenario) {
         console.log("After Step");
        
         // if (scenario.error) {
         //     browser.takeScreenshot();
         // }
     },
 });
 
 module.exports = {
     config: customConfig,
     featureFilesWithTags: featureFilesWithTags,
     mobCapabilities: mobCapabilities,
 };
 