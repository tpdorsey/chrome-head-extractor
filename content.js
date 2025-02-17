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

// Function to extract WaPo Headlines with maxArticles limit
function extractWapoHeadlines(maxArticles = 10) {
    const outletName = "Washington Post";
    const storyDivs = document.querySelectorAll('div[data-feature-id="homepage/story"]');
    
    // Prepare an array to hold our result objects
    const articles = [];
  
    // Loop through the divs and add only those with an <h2>, stopping after 10 valid items
    for (let i = 0; i < storyDivs.length && articles.length < maxArticles; i++) {
        const div = storyDivs[i];
        
        // Get the first h2 element inside the div; skip this div if none exists
        const h2Elem = div.querySelector('h2');
        if (!h2Elem) continue;
        
        // Get the first a element inside the div
        const aElem = div.querySelector('a');
        
        // Get the div with class "font-size-blurb", if it exists
        const blurbElem = div.querySelector('div.font-size-blurb');

        articles.push({
            id: articles.length + 1,
            outlet: outletName,
            href: aElem ? aElem.href : "",
            headline: h2Elem.innerText.trim(),
            blurb: blurbElem ? blurbElem.innerText.trim() : "",
            category: ""
        });
    }

    return articles;
}

// Function to extract Fox News Politics Headlines with maxArticles limit
function extractFoxPoliticsHeadlines(maxArticles = 10) {
    const outletName = "Fox News";
    const storyDivs = document.querySelectorAll('h2.title, h4.title');
    const articles = [];

    for (let i = 0; i < storyDivs.length && articles.length < maxArticles; i++) {
        const div = storyDivs[i];
        const aElem = div.querySelector('a');
        if (!aElem) continue;

        const href = aElem.getAttribute('href') || "";
        // const headlineElem = div.querySelector('h2.title, h4.title');
        // if (!headlineElem) continue;

        // const headline = headlineElem.innerText.trim();
        const headline = div.innerText.trim() || "";

        articles.push({
            id: articles.length + 1,
            outlet: outletName,
            href: href,
            headline: headline,
            blurb: "",
            category: ""
        });
    }

    return articles;
}

// Function to extract Fox News Politics Headlines with maxArticles limit
function extractFoxNewsHeadlines(maxArticles = 10) {
    const outletName = "Fox News";
    const storyDivs = document.querySelectorAll('h3.title');
    const articles = [];

    for (let i = 0; i < storyDivs.length && articles.length < maxArticles; i++) {
        const div = storyDivs[i];
        const aElem = div.querySelector('a');
        if (!aElem) continue;

        const href = aElem.getAttribute('href') || "";
        // const headlineElem = div.querySelector('h2.title, h4.title');
        // if (!headlineElem) continue;

        // const headline = headlineElem.innerText.trim();
        const headline = div.innerText.trim() || "";

        articles.push({
            id: articles.length + 1,
            outlet: outletName,
            href: href,
            headline: headline,
            blurb: "",
            category: ""
        });
    }

    return articles;
}

// Function to extract NBC News Headlines with maxArticles limit
function extractNbcHeadlines(maxArticles = 10) {
    const outletName = "NBC News";
    const storyDivs = document.querySelectorAll("h2 a, h3 a, .liveblog-layout__container-top a, .related-content-tease a");
    const articles = [];
    const seenHeadlines = new Set();

    for (let i = 0; i < storyDivs.length && articles.length < maxArticles; i++) {
        const link = storyDivs[i];
        let headlineText = "";
        
        // For live stories, the headline might be nested in an h2 inside the anchor.
        const nestedH2 = link.querySelector("h2");
        if (nestedH2 && nestedH2.textContent.trim()) {
          headlineText = nestedH2.textContent.trim();
        } else {
          // Otherwise, take the text of the anchor itself.
          headlineText = link.textContent.trim();
        }
        
        // Skip empty headlines or duplicates.
        if (!headlineText || seenHeadlines.has(headlineText)) continue;
        seenHeadlines.add(headlineText);

        articles.push({
            id: articles.length + 1,
            outlet: outletName,
            href: link.href,
            headline: headlineText,
            blurb: "",
            category: ""
        });
    }

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
    } else if (url.includes("washingtonpost.com")) {
        return {
            source: "The Washington Post",
            slug: "wapo",
            url: url,
            extracted: extractedTime,
            articles: extractWapoHeadlines(maxArticles)
        };
    } else if (url.includes("foxnews.com/politics")) {
        return {
            source: "Fox News (Politics)",
            slug: "foxp",
            url: url,
            extracted: extractedTime,
            articles: extractFoxPoliticsHeadlines(maxArticles)
        };
    } else if (url.includes("foxnews.com")) {
        return {
            source: "Fox News",
            slug: "foxn",
            url: url,
            extracted: extractedTime,
            articles: extractFoxNewsHeadlines(maxArticles)
        };
    } else if (url.includes("nbcnews.com")) {
        return {
            source: "NBC News",
            slug: "nbc",
            url: url,
            extracted: extractedTime,
            articles: extractNbcHeadlines(maxArticles)
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
