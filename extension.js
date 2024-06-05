// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

const SECONDS_MULTIPLIER = 1000;
const MINUTES_MULTIPLIER = 1000 * 60;
const HOURS_MULTIPLIER = 1000 * 60 * 60;
const DAYS_MULTIPLIER = 1000 * 60 * 60 * 24;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	vscode.window.showInformationMessage('Happy coding!');

	var intervalTimer;
	var lastSelectedMessage = '';

	let firstRun = true;

	const getIntervalMultiplier = function(intervalUnit) {
		let intervalMultiplier = SECONDS_MULTIPLIER;

		switch (intervalUnit) {
			case "Seconds":
				intervalMultiplier = SECONDS_MULTIPLIER;
				break;
			case "Minutes":
				intervalMultiplier = MINUTES_MULTIPLIER;
				break;
			case "Hours":
				intervalMultiplier = HOURS_MULTIPLIER;
				break;
			case "Days":
				intervalMultiplier = DAYS_MULTIPLIER;
				break;
			default:
				intervalMultiplier = SECONDS_MULTIPLIER;
				break;
		}

		return intervalMultiplier;
	}

	const getRandomMessage = function (settings, lastMessage) {
		const messages = settings.get('messages');
		const messagesArray = messages.split('\n');

		let randomMessage = Math.floor(Math.random() * messagesArray.length);

		while (messagesArray[randomMessage] === lastMessage) {
			randomMessage = Math.floor(Math.random() * messagesArray.length);
		}

		return messagesArray[randomMessage];
	}

	const showMessages = function () {
		const motificationsConfig = vscode.workspace.getConfiguration('motifications');

		const intervalUnit = motificationsConfig.get('interval.unit');
		const intervalValue = motificationsConfig.get('interval.value');

		let intervalMultiplier = getIntervalMultiplier(intervalUnit);

		const currentDate = new Date();

		const customTimesFlag = motificationsConfig.get('messages.custom');
		const customTimesString = motificationsConfig.get('messages.custom.times');

		let message = getRandomMessage(motificationsConfig, lastSelectedMessage);
		lastSelectedMessage = message;

		if (!firstRun) {
			if (message.includes("🐞")) {
				vscode.window.showInformationMessage(message, "Squash", "Change Settings")
				.then(selection => {
					if (selection === "Squash") {
						vscode.window.showInformationMessage("Bug squashed!")
					}
					else if (selection === "Change Settings") {
						vscode.commands.executeCommand('workbench.action.openSettings', 'motifications');
					}
				});
			} else {
				vscode.window.showInformationMessage(message, "Change Settings")
				.then(selection => {
					if (selection === "Change Settings") {
						vscode.commands.executeCommand('workbench.action.openSettings', 'motifications');
					}
				});
			}
		}

		firstRun = false;

		clearInterval(intervalTimer);
		intervalTimer = setInterval(showMessages, intervalValue * intervalMultiplier);
	 };

	 showMessages();

	 vscode.workspace.onDidChangeConfiguration(event => {
        let settingsChanged = event.affectsConfiguration("motifications");
        if (settingsChanged) {
            firstRun = true;

			showMessages();
        }
    })
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
