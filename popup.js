let extractedData = null; // Store the extracted data globally

document.addEventListener("DOMContentLoaded", function () {
    const extractBtn = document.getElementById("extract");
    const copyBtn = document.getElementById("copy");
    const output = document.getElementById("output");
    const maxArticlesInput = document.getElementById("maxArticles");

    extractBtn.addEventListener("click", async () => {
        extractBtn.textContent = "Extracting...";
        extractBtn.disabled = true;

        const maxArticles = parseInt(maxArticlesInput.value, 10) || 10; // Default to 10 if empty

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.tabs.sendMessage(tab.id, { command: "extractData", maxArticles: maxArticles }, (response) => {
            if (response) {
                extractedData = response;
                output.textContent = JSON.stringify(response, null, 2);
            } else {
                output.textContent = "Failed to extract data.";
            }

            setTimeout(() => {
                extractBtn.textContent = "Extract Data";
                extractBtn.disabled = false;
            }, 1000);
        });
    });

    copyBtn.addEventListener("click", () => {
        if (extractedData) {
            const jsonString = JSON.stringify(extractedData, null, 2);
            navigator.clipboard.writeText(jsonString).then(() => {
                copyBtn.textContent = "Copied!";
                copyBtn.disabled = true;

                setTimeout(() => {
                    copyBtn.textContent = "Copy to Clipboard";
                    copyBtn.disabled = false;
                }, 1500);
            }).catch((err) => {
                console.error("Failed to copy JSON to clipboard:", err);
            });
        } else {
            output.textContent = "No data to copy. Please extract data first.";
        }
    });
});
