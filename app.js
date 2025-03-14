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

    // Check if the user has premium access
    const isPremiumUser = localStorage.getItem("premiumEnabled") === "true";

    document.getElementById("speedSlider").addEventListener("input", function (event) {
        let selectedSpeed = parseInt(event.target.value, 10); // Get the selected speed from slider
        const maxSpeed = isPremiumUser ? 1000 : 600; // Set max speed based on user status

        // Restrict speed for non-premium users
        if (!isPremiumUser && selectedSpeed > maxSpeed) {
            alert("Nuh uh. Only premium users may go above 600wpm. Buy premium on 'SpeedReeder Premium' page in top right");
            selectedSpeed = maxSpeed; // Reset to max allowed speed for non-premium users
            event.target.value = maxSpeed; // Update slider position
        }

        // Update the displayed speed
        currentSpeed = selectedSpeed;
        document.getElementById("currentSpeed").textContent = `${currentSpeed} WPM`;

        // Update the word interval if not paused
        if (!isPaused) {
            clearInterval(wordInterval);
            wordInterval = setInterval(displayWords, getIntervalFromSpeed(currentSpeed));
        }
    });
}


const scanTextButton = document.getElementById('scanTextButton');

cameraButton.addEventListener('click', async () => {
    try {
        // Request camera access
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Attach the stream to the video element
        cameraStream.srcObject = mediaStream;

        // Display the video container
        videoContainer.style.display = 'block';
        scanTextButton.style.display = 'inline-block';
        cameraButton.style.display = 'none';

        // Dynamically adjust aspect ratio
        const settings = mediaStream.getVideoTracks()[0].getSettings();
        const aspectRatio = settings.aspectRatio || 16 / 9;
        videoContainer.style.aspectRatio = `${aspectRatio}`;
    } catch (error) {
        console.error('Error accessing the camera:', error);
        alert('Could not access the camera. Please check permissions and try again.');
    }
});

scanTextButton.addEventListener('click', async () => {
    const loadingOverlay = document.getElementById('loadingOverlay');
    try {
        // Show the loading overlay
        loadingOverlay.style.display = 'flex';

        // Create a canvas to capture the current frame
        const canvas = document.createElement('canvas');
        canvas.width = cameraStream.videoWidth;
        canvas.height = cameraStream.videoHeight;
        const ctx = canvas.getContext('2d');

        // Draw the current frame from the video feed
        ctx.drawImage(cameraStream, 0, 0, canvas.width, canvas.height);

        // Convert canvas to image data
        const imageDataURL = canvas.toDataURL('image/png');

        // Use Tesseract.js to perform OCR on the captured frame
        const { data: { text } } = await Tesseract.recognize(imageDataURL, 'eng', {
            logger: (m) => {
                if (m.status === 'recognizing text') {
                    console.log(`Progress: ${Math.round(m.progress * 100)}%`);
                }
            }
        });

        // Save the extracted text to localStorage
        localStorage.setItem('inputText', text.trim());

        // Redirect to the display page
        window.location.href = 'display.html';
    } catch (error) {
        console.error('Error during OCR processing:', error);
        alert('Failed to scan text. Please try again.');
    } finally {
        // Hide the loading overlay
        loadingOverlay.style.display = 'none';

        // Stop the camera feed and hide the video container
        if (mediaStream) {
            const tracks = mediaStream.getTracks();
            tracks.forEach(track => track.stop());
            cameraStream.srcObject = null;
        }
        videoContainer.style.display = 'none';
        scanTextButton.style.display = 'none';
        cameraButton.style.display = 'inline-block';
    }
});

