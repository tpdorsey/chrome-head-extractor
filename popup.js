let extractedData = null; // Store the extracted data globally

document.addEventListener("DOMContentLoaded", function () {
    const extractBtn = document.getElementById("extract");
    const copyBtn = document.getElementById("copy");
    const output = document.getElementById("output");

    // Function to extract data from the active tab
    extractBtn.addEventListener("click", async () => {
        extractBtn.textContent = "Extracting...";
        extractBtn.disabled = true; // Prevent multiple clicks

        // Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Send a message to the content script
        chrome.tabs.sendMessage(tab.id, { command: "extractData" }, (response) => {
            if (response) {
                extractedData = response; // Store the extracted data
                output.textContent = JSON.stringify(response, null, 2); // Display formatted JSON
            } else {
                output.textContent = "Failed to extract data.";
            }

            // Restore button state after 1 second
            setTimeout(() => {
                extractBtn.textContent = "Extract Data";
                extractBtn.disabled = false;
            }, 1000);
        });
    });

    // Function to copy extracted data to the clipboard in JSON format
    copyBtn.addEventListener("click", () => {
        if (extractedData) {
            const jsonString = JSON.stringify(extractedData, null, 2);
            navigator.clipboard.writeText(jsonString).then(() => {
                copyBtn.textContent = "Copied!";
                copyBtn.disabled = true;

                // Restore button text after 1.5 seconds
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
