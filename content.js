// Function to extract NYT Headlines with maxArticles limit
function extractNytHeadlines(maxArticles = 10) {
    const outletName = "The New York Times";
    const storyWrappers = document.querySelectorAll('section.story-wrapper');
    const articles = [];

    for (let i = 0; i < storyWrappers.length && articles.length < maxArticles; i++) {
        const story = storyWrappers[i];
        const aElem = story.querySelector('a');
        if (!aElem) continue;

        const href = aElem.getAttribute('href') || "";
        const headlineElem = aElem.querySelector('p.indicate-hover');
        if (!headlineElem) continue;

        const headline = headlineElem.innerText.trim();
        const blurbElem = story.querySelector('p.summary-class');
        const blurb = blurbElem ? blurbElem.innerText.trim() : "";

        articles.push({
            id: articles.length + 1,
            outlet: outletName,
            href: href,
            headline: headline,
            blurb: blurb,
            category: ""
        });
    }

    return articles;
}

// Function to extract WSJ Headlines with maxArticles limit
function extractWsjHeadlines(maxArticles = 10) {
    const outletName = "Wall Street Journal";
    const container = document.querySelector('div[data-layout-type="visual-eleven"]');

    if (!container) {
        console.error("Container with data-layout-type='visual-eleven' not found.");
        return [];
    }

    const articleElements = container.querySelectorAll('div[data-parsely-slot^="visual-eleven-article-"]');
    const articles = [];

    articleElements.forEach((articleElem, index) => {
        if (articles.length >= maxArticles) return;

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
            id: articles.length + 1,
            outlet: outletName,
            href: href,
            headline: headline,
            blurb: blurb,
            category: ""
        });
    });

    return articles;
}

// Function to extract data based on domain with maxArticles option
function extractHeadlineData(maxArticles = 10) {
    const url = window.location.href;
    const extractedTime = new Date().toISOString();

    if (url.includes("nytimes.com")) {
        return {
            source: "The New York Times",
            slug: "nyt",
            url: url,
            extracted: extractedTime,
            articles: extractNytHeadlines(maxArticles)
        };
    } else if (url.includes("wsj.com")) {
        return {
            source: "Wall Street Journal",
            slug: "wsj",
            url: url,
            extracted: extractedTime,
            articles: extractWsjHeadlines(maxArticles)
        };
    }

    return { source: "Unknown", url: url, extracted: extractedTime, articles: [] };
}

// Listen for messages and return extracted data with maxArticles override
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "extractData") {
        const maxArticles = message.maxArticles || 10; // Default to 10 if not set
        sendResponse(extractHeadlineData(maxArticles));
        return true; // Async response fix
    }
});
