const inputText = document.getElementById("inputText");
const button = document.getElementById("processButton");
const outputText = document.getElementById("outputText");
const clearInputButton = document.getElementById("clearInputButton");
const clearOutputButton = document.getElementById("clearOutputButton");
const copyButton = document.getElementById("copyButton");

function updateOutput() {
    const inputValue = inputText.value.trim();

    try {
        const jsonData = JSON.parse(inputValue);

        if (jsonData && jsonData.data && jsonData.data[0] && jsonData.data[0]._id) {

            const stepsArray = jsonData.data[0].steps;
            const lastStepIndex = stepsArray.length - 1;
            const lastStep = stepsArray[lastStepIndex];
            const screenshot = `**Screenshot** \n${jsonData.data[0].screenshot.original.defaultUrl}`;


            if (lastStep && lastStep.extra && lastStep.extra.accessibility && lastStep.extra.accessibility.issues) {
                const issues = lastStep.extra.accessibility.issues;
                let output = "";
           
                for (const issue of issues) {
                    if (issue.help && issue.helpUrl) {
                        let nodesOutput = `Class name:** `;
                        if (issue.nodes.length > 0) {
                            nodesOutput += issue.nodes.map(node => `\n  - [ ] ${node}`).join('');
                        }
                        const formattedIssue = `${nodesOutput}\n**Error:** ${issue.help}\n**Deque University link:** ${issue.helpUrl}\n\n`;
                        output += formattedIssue;
                    }
                }
                output += screenshot;

                return (`**Issues to fix**\n\n${output}`);
            } else {
                console.log('Error: Issues array or its properties are undefined.');
            }


        } else {
            throw new Error("Invalid JSON format");
        }
    } catch (error) {
        console.error("Error parsing JSON input:", error.message);
        return null;
    }
}

button.addEventListener("click", () => {
    const res = updateOutput();
        outputText.textContent = res;


});


clearOutputButton.addEventListener("click", () => {
    outputText.textContent = ""; // Clear the outputText area
});

clearInputButton.addEventListener("click", () => {
    inputText.value = ""; // Clear the outputText area
});

copyButton.addEventListener("click", () => {
    outputText.select();
    document.execCommand("copy"); // Copy the text inside outputText to clipboard
});
