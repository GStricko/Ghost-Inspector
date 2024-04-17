const inputText = document.getElementById("inputText");
const button = document.getElementById("processButton");
const outputText = document.getElementById("outputText");
const clearInputButton = document.getElementById("clearInputButton");
const clearOutputButton = document.getElementById("clearOutputButton");
const copyButton = document.getElementById("copyButton");

async function updateOutput() {
    const inputValue = inputText.value.trim();
    
    try {
        const apiRes = await getData(inputValue);

        if (apiRes && apiRes.data && apiRes.data[0] && apiRes.data[0]._id) {

            const stepsArray = apiRes.data[0].steps;
            const lastStepIndex = stepsArray.length - 1;
            const lastStep = stepsArray[lastStepIndex];
            const screenshot = `**Screenshot** \n${apiRes.data[0].screenshot.original.defaultUrl}`;


            if (lastStep && lastStep.extra && lastStep.extra.accessibility && lastStep.extra.accessibility.issues) {
                const issues = lastStep.extra.accessibility.issues;
                let output = "";
           
                for (const issue of issues) {
                    if (issue.help && issue.helpUrl) {
                        let nodesOutput = `**Class name:** `;
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

button.addEventListener("click", async () => {
    const res = await updateOutput();
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

async function getData(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Optionally rethrow the error
    }
}

