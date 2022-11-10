"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
function devExecutor(_a, context) {
    var turbopack = _a.turbopack;
    console.info("Executing \"next dev\"...");
    var projectDir = context.workspace.projects[context.projectName].root;
    return new Promise(function (resolve, reject) {
        var devProcess = (0, child_process_1.exec)("next dev ".concat(turbopack ? "--turbo" : "", " ").concat(projectDir), function (error, stdout, stderr) {
            if (error) {
                reject(error);
            }
            resolve({ success: !stderr });
        });
        devProcess.stdout.setEncoding("utf8");
        devProcess.stdout.on("data", console.log);
        devProcess.stderr.setEncoding("utf8");
        devProcess.stderr.on("data", console.error);
    });
}
exports["default"] = devExecutor;
