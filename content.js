// Function to extract WSJ Headlines
function extractWsjHeadlines() {
    const outletName = "Wall Street Journal";
    const container = document.querySelector('div[data-layout-type="visual-eleven"]');

    if (!container) {
        console.error("Container with data-layout-type='visual-eleven' not found.");
        return [];
    }

    const articleElements = container.querySelectorAll('div[data-parsely-slot^="visual-eleven-article-"]');
    const articles = [];

    articleElements.forEach((articleElem, index) => {
        const h3Elem = articleElem.querySelector('h3');
        if (!h3Elem) return;

        const aElem = h3Elem.querySelector('a');
        if (!aElem) return;

        const href = aElem.getAttribute('href') || "";
        const headlineDiv = aElem.querySelector('div');
        if (!headlineDiv) return;

        const headline = headlineDiv.innerText.trim();
        if (!headline) return;

        const blurbElem = articleElem.querySelector('p[data-testid="flexcard-text"]');
        const blurb = blurbElem ? blurbElem.innerText.trim() : "";

        articles.push({
            id: index + 1,
            outlet: outletName,
            href: href,
            headline: headline,
            blurb: blurb,
            category: ""
        });
    });

    return articles;
}

// Function to extract data based on domain
function extractHeadlineData() {
    const url = window.location.href;
    const extractedTime = new Date().toISOString(); // Get timestamp in ISO 8601 format

    if (url.includes("wsj.com")) {
        return {
            source: "Wall Street Journal",
            url: url,
            extracted: extractedTime, // Timestamp of extraction
            articles: extractWsjHeadlines()
        };
    }

    return { source: "Unknown", url: url, extracted: extractedTime, articles: [] };
}

// Listen for messages from the popup and return extracted data
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "extractData") {
        sendResponse(extractHeadlineData());
        return true; // Indicates async response to prevent errors in Chrome
    }
});
