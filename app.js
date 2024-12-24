// Theme Toggle Functionality
const themeToggleButton = document.getElementById("theme-toggle");
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggleButton.textContent = "☀️";
} else {
    themeToggleButton.textContent = "🌙";
}

themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        themeToggleButton.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggleButton.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});

// Variables for word display
let words = [];
let index = 0;
let relativeIndex = 0;  // Dynamic relative index
let isPaused = false;
let wordInterval;
let currentSpeed = 300; // Default words per minute (WPM)

// Calculate time remaining
function calculateTimeRemaining() {
    const totalWords = words.length;
    const wordsLeft = totalWords - relativeIndex;
    const timeRemainingInSeconds = (wordsLeft / currentSpeed) * 60;

    const minutes = Math.floor(timeRemainingInSeconds / 60);
    const seconds = Math.round(timeRemainingInSeconds % 60);

    return { minutes, seconds };
}

// Update time remaining in the UI
function updateTimeRemainingUI() {
    const { minutes, seconds } = calculateTimeRemaining();
    const timeRemainingElement = document.getElementById("timeRemaining");
    if (timeRemainingElement) {
        timeRemainingElement.textContent = `Time Remaining: ${minutes} minutes, ${seconds} seconds`;
    }
}

// Store the input text and navigate to display page
function startDisplay() {
    const textInput = document.getElementById("textInput").value.trim();
    if (!textInput) {
        alert("Please enter or upload text first!");
        return;
    }

    localStorage.setItem("inputText", textInput); // Store text for the display page
    window.location.href = "display.html"; // Navigate to display.html
}

// Function to get interval based on speed (WPM)
function getIntervalFromSpeed(wpm) {
    return (60 / wpm) * 1000; // Return interval in milliseconds
}

// Function to display words
function displayWords() {
    const displayArea = document.getElementById("displayArea");
    const previewContainer = document.getElementById("previewContainer");

    if (!isPaused && relativeIndex < words.length) {
        displayArea.textContent = words[relativeIndex];
        updatePreview(); // Ensure preview container updates with the current word
        relativeIndex++;
        updateTimeRemainingUI(); // Dynamically update remaining time
    } else if (relativeIndex >= words.length) {
        clearInterval(wordInterval); // Stop reading when all words are displayed
    }
}

// Pause and Resume functionality
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(wordInterval); // Clear current interval when paused
    } else {
        clearInterval(wordInterval); // Ensure no old interval is running
        wordInterval = setInterval(displayWords, getIntervalFromSpeed(currentSpeed)); // Restart with new interval
    }
}

// Move back 10 words
function backTenWords() {
    relativeIndex = Math.max(0, relativeIndex - 10);
    isPaused = false;
    clearInterval(wordInterval); // Clear previous interval
    wordInterval = setInterval(displayWords, getIntervalFromSpeed(currentSpeed)); // Restart with new interval
}

// Update preview with current and upcoming words
function updatePreview() {
    const previewContainer = document.getElementById("previewContainer");

    if (!previewContainer) {
        console.error("Preview container not found!");
        return;
    }

    // Update the preview container content with clickable words
    previewContainer.innerHTML = words
        .map((word, i) =>
            i === relativeIndex
                ? `<span class="highlighted-word" data-index="${i}">${word}</span>`
                : `<span class="preview-word" data-index="${i}">${word}</span>`
        )
        .join(" ");

    // Add click listeners to preview words
    const previewWords = previewContainer.querySelectorAll(".preview-word, .highlighted-word");

    previewWords.forEach((word) => {
        word.addEventListener("click", (event) => {
            const wordIndex = parseInt(event.target.dataset.index, 10);

            if (!isNaN(wordIndex)) {
                relativeIndex = wordIndex; // Update to clicked word index
                isPaused = true; // Pause
                clearInterval(wordInterval); // Clear current reading interval

                // Update the preview with the selected word and all following words
                updatePreviewFromSelectedWord(wordIndex);

                // Adjust the scroll position manually
                setTimeout(() => {
                    const selectedWord = previewContainer.querySelector(`.highlighted-word[data-index="${wordIndex}"]`);
                    if (selectedWord) {
                        const wordRect = selectedWord.getBoundingClientRect();
                        const containerRect = previewContainer.getBoundingClientRect();
                        const scrollAdjustment = wordRect.top - containerRect.top - (containerRect.height / 2);
                        previewContainer.scrollTop += scrollAdjustment;
                    }

                    // Clear the old interval and set a new one with current speed
                    clearInterval(wordInterval);
                    wordInterval = setInterval(displayWords, getIntervalFromSpeed(currentSpeed)); // Resume reading
                    isPaused = false; // Automatically resume after delay
                }, 200); // 200 ms delay before resuming
            } else {
                console.error("Invalid word index clicked!");
            }
        });
    });

    // Scroll the highlighted word into view after updating the preview
    const highlightedWord = previewContainer.querySelector(".highlighted-word");
    if (highlightedWord) {
        const wordRect = highlightedWord.getBoundingClientRect();
        const containerRect = previewContainer.getBoundingClientRect();
        const scrollAdjustment = wordRect.top - containerRect.top - (containerRect.height / 2);
        previewContainer.scrollTop += scrollAdjustment;
    }
}

// Update preview from the selected word (showing both previous and upcoming words)
function updatePreviewFromSelectedWord(clickedIndex) {
    const previewContainer = document.getElementById("previewContainer");

    // Update the preview container with all words from the clicked word onward
    previewContainer.innerHTML = words
        .map((word, i) =>
            i === clickedIndex
                ? `<span class="highlighted-word" data-index="${i}">${word}</span>`
                : `<span class="preview-word" data-index="${i}">${word}</span>`
        )
        .join(" ");

    // Add click listeners for all words in the preview
    const previewWords = previewContainer.querySelectorAll(".preview-word, .highlighted-word");

    previewWords.forEach((word) => {
        word.addEventListener("click", (event) => {
            const wordIndex = parseInt(event.target.dataset.index, 10);

            if (!isNaN(wordIndex)) {
                relativeIndex = wordIndex; // Update to clicked word index
                isPaused = true; // Pause
                clearInterval(wordInterval); // Clear current reading interval

                // Update the preview with the selected word and all following words
                updatePreviewFromSelectedWord(wordIndex);

                // Adjust the scroll position manually
                setTimeout(() => {
                    const selectedWord = previewContainer.querySelector(`.highlighted-word[data-index="${wordIndex}"]`);
                    if (selectedWord) {
                        const wordRect = selectedWord.getBoundingClientRect();
                        const containerRect = previewContainer.getBoundingClientRect();
                        const scrollAdjustment = wordRect.top - containerRect.top - (containerRect.height / 2);
                        previewContainer.scrollTop += scrollAdjustment;
                    }

                    // Clear the old interval and set a new one with current speed
                    clearInterval(wordInterval);
                    wordInterval = setInterval(displayWords, getIntervalFromSpeed(currentSpeed));
                    isPaused = false;
                }, 200); // 200 ms delay before resuming
            } else {
                console.error("Invalid word index clicked!");
            }
        });
    });
}

// File Reading Functionality
function readTextFromPDF(pdfFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const pdfData = new Uint8Array(e.target.result);
        pdfjsLib
            .getDocument(pdfData)
            .promise.then((pdf) => {
                let textContent = "";
                const numPages = pdf.numPages;

                for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                    pdf.getPage(pageNum).then((page) => {
                        page.getTextContent().then((text) => {
                            text.items.forEach((item) => {
                                textContent += item.str + " ";
                            });

                            if (pageNum === numPages) {
                                document.getElementById("textInput").value = textContent;
                            }
                        });
                    });
                }
            })
            .catch((error) => {
                console.error("Error reading PDF:", error);
            });
    };
    reader.readAsArrayBuffer(pdfFile);
}

function initializeDisplayPage() {
    const storedText = localStorage.getItem("inputText");

    if (storedText) {
        words = storedText.match(/\w+['\w]*[.,!?;:]?/g) || [];
        relativeIndex = 0; // Reset relative index
        isPaused = false;

        document.getElementById("displayArea").textContent = ""; // Clear display area
        updatePreview(); // Populate the preview container
        updateTimeRemainingUI(); // Initialize time remaining UI

        if (wordInterval) clearInterval(wordInterval);
        wordInterval = setInterval(displayWords, getIntervalFromSpeed(currentSpeed));
    } else {
        console.error("No text found in localStorage.");
        document.getElementById("displayArea").textContent =
            "No text available. Please return to the main page and enter text.";
    }
}

// Event Listener for file input (index.html)
if (document.getElementById("fileInput")) {
    document.getElementById("fileInput").addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            const fileType = file.type;

            if (fileType === "image/png") {
                // Set initial placeholder text as "Reading text..."
                const textInput = document.getElementById("textInput");
                textInput.placeholder = "Reading text... 0%";

                Tesseract.recognize(file, "eng", {
                    logger: (m) => {
                        // Calculate and update the reading progress
                        if (m.status === "recognizing text") {
                            const progress = Math.round(m.progress * 100); // Get percentage
                            textInput.placeholder = `Reading text... ${progress}%`;
                        }
                    }
                })
                    .then(({ data: { text } }) => {
                        // After OCR is complete, insert the recognized text into the input box
                        textInput.value = text;
                        textInput.placeholder = "Enter or paste text here..."; // Reset placeholder
                    })
                    .catch((error) => {
                        console.error("Error during OCR processing:", error);
                    });
            } else if (fileType === "application/pdf") {
                readTextFromPDF(file);
            } else {
                alert("Please upload a PNG image or PDF file.");
            }
        }
    });
    document.getElementById("displayButton").addEventListener("click", startDisplay);
}


// Event Listeners (display.html)
if (document.getElementById("displayArea")) {
    initializeDisplayPage();
    document.getElementById("pauseResumeButton").addEventListener("click", togglePause);
    document.getElementById("backTenWordsButton").addEventListener("click", backTenWords);

    document.getElementById("speedSlider").addEventListener("input", function (event) {
        currentSpeed = event.target.value;
        document.getElementById("currentSpeed").textContent = `${currentSpeed} WPM`;

        if (!isPaused) {
            clearInterval(wordInterval);
            wordInterval = setInterval(displayWords, getIntervalFromSpeed(currentSpeed));
        }
    });
}

