async function loadEvents() {
    // ... (containers and futureEvents declaration) ...

    try {
        const response = await fetch('assets/data/events/event1.txt');
        const data = await response.text();
        const futureContainer = document.getElementById('futureEvents');
        const pastContainer = document.getElementById('pastEvents');
        
        // --- MODIFIED PARSING LOGIC ---
        
        // 1. Clean the entire file content by replacing Windows line breaks (\r\n) with Unix (\n)
        //    and then replace MULTIPLE consecutive line breaks with just one.
        //    This standardizes the file regardless of the source.
        const cleanedData = data.replace(/\r\n/g, '\n').replace(/\n\n+/g, '\n');

        // 2. Split the content into event blocks using the delimiter.
        //    Using a regex split ensures we catch the delimiter regardless of surrounding whitespace.
        const eventBlocks = cleanedData.trim().split(/\n---\n/);
        
        // --- END MODIFIED PARSING LOGIC ---

        const futureEvents = [];

        eventBlocks.forEach((block, index) => {
            // 3. Split the current block into its individual lines
            //    We still need to trim and filter out any final empty lines just in case.
            const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);

            // --- THIS IS WHERE THE ERROR IS CAUGHT ---
            if (lines.length !== 5) {
                console.warn(`Skipping event block ${index + 1}: Expected 5 data lines, found ${lines.length}.`);
                
                // OPTIONAL: Display the problematic block content to help debug the text file
                console.log("Problematic Block Content:", block); 
                return; 
            }
            
            // 3. Extract the 5 components
            const eventName = lines[0];
            const dateTimeStr = lines[1];
            const locationLine = lines[2];
            const description = lines[3];
            const extraInfo = lines[4];

            // Split the Location line into text and link URL
            const [locationText, locationLink] = locationLine.split('|').map(item => item.trim());

            // --- Date Comparison and Sorting Preparation ---
            const eventDate = new Date(dateTimeStr.split(' at ')[0]); 
            const isFuture = eventDate > new Date();
            
            const eventData = {
                id: `event-${index + 1}-info`, // Unique ID based on block position
                eventName,
                dateTimeStr,
                locationText,
                locationLink,
                description,
                extraInfo,
                date: eventDate // Store the Date object for sorting
            };

            if (isFuture) {
                futureEvents.push(eventData);
            } else {
                renderEventCard(pastContainer, eventData);
            }
        });
        
        // --- Sort Future Events (Nearest one first) ---
        futureEvents.sort((a, b) => a.date - b.date);
        
        // --- Render Sorted Future Events ---
        futureEvents.forEach(event => {
            renderEventCard(futureContainer, event);
        });

    } catch (error) {
        console.error('Error loading events:', error);
    }
}

// (Keep the renderEventCard helper function the same as before)
function renderEventCard(container, data) {
    const { id, eventName, dateTimeStr, locationText, locationLink, description, extraInfo } = data;
    
    const eventCardHTML = `
        <div class="card">
            <button class="info-btn" onclick="togglePopup('${id}')">i</button>
            <div class="top-text">
                <h3>${eventName}</h3>
            </div>
            <div class="timeplace">
                <p>${dateTimeStr}</p>
            </div>
            <div class="timeplace">
                <a href="${locationLink}" target="_blank">
                    <p>${locationText}</p>
                </a> 
            </div>
            <div class="bottom-text">
                <p>${description}</p>
            </div>
            <div id="${id}" class="popup-overlay">
                <div class="popup-content">
                    <span class="close-btn" onclick="togglePopup('${id}')">×</span>
                    <h2>${eventName} Details</h2>
                    <p>${extraInfo}</p>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', eventCardHTML);
}

window.addEventListener('DOMContentLoaded', loadEvents);