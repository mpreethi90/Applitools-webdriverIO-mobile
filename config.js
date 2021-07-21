module.exports = {
    environment: process.env.ENVIRONMENT || "integration",
    country: process.env.COUNTRY || "SG",
    platform: process.env.PLATFORM || "ios",
    deviceName: process.env.DEVICE_NAME,
    deviceVersion: process.env.DEVICE_VERSION,
    // saucelabConfig: {
    //     user: process.env.SAUCE_USERNAME,
    //     key: process.env.SAUCE_ACCESSKEY,
    //     services: ["sauce", ['applitools', {
    //         key: 'Q74566t4hUBqYCmWLDdgf7qsh19fy9RpM0uyVR0OAmk110', 
    //         appName: 'consumeriOS'
    //     }]], 
    //     enableEyesLogs:true,
    //     maxInstances: 2,
    // },
    localConfig: {
        runner: "local",
        services: [
            ["appium", {
                waitStartTime: 6000,
                waitforTimeout: 2 * 60000,
                command: "appium",
                logLevel: "error",
                logPath: "./appium.log",
                args: {
                    address: "127.0.0.1",
                    port: 4232,
                    sessionOverride: true,
                    debugLogSpacing: true,
                    nativeInstrumentsLib: true,
                    allowInsecure: "adb_shell",
                }
        }], 
        // ["native-app-compare", {
        //     // Mandatory
        //     baselineFolder: './screenshots/image-baseline',
        //     screenshotPath: './screenshots/image-compare',
        //     autoSaveBaseline: true
        //     // Optional
        //     // See Options for more options
        //     //..
        // }], 
        ['applitools', {
            key: 'Q74566t4hUBqYCmWLDdgf7qsh19fy9RpM0uyVR0OAmk110', 
            appName: 'ConsumeriOS',
        }]
    ],
        maxInstances: 1,
        host: "127.0.0.1",
        port: 4232,
    },
};
