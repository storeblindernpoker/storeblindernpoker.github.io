async function loadLeaderboard(filename) {
    const container = document.getElementById('leaderboard-body');
    if (!container) return;

    // --- STEP A: Clear old data rows ---
    // We select all rows inside the container...
    const allRows = container.querySelectorAll('.lb-row');
    // ...and remove them, IGNORING the first one (because that is your Header)
    for (let i = 1; i < allRows.length; i++) {
        allRows[i].remove();
    }

    try {
        // --- STEP B: Fetch the specific file passed in the argument ---
        // const response = await fetch(`assets/data/leaderBoards/${filename}`);
        const response = await fetch(`assets/data/leaderBoards/${filename}`);
        // const response = await fetch('assets/data/leaderBoards/season2');
        
        // Check if file exists
        if (!response.ok) {
            console.error("File not found:", filename);
            return;
        }

        const data = await response.text();

        // --- STEP C: Process the text ---
        const lines = data.trim().split('\n');

        lines.forEach(line => {
            // Remove any extra whitespace from the line (carriage returns)
            const cleanLine = line.trim();
            if (!cleanLine) return; // Skip empty lines

            const [change, rank, name, points] = cleanLine.split(',');

            if (change && rank && name && points) {
                const row = document.createElement('div');
                row.className = 'lb-row';

                row.innerHTML = `
                    <form class="form">${change}</form>
                    <form class="form">${rank}</form>
                    <form class="form">${name}</form>
                    <form class="form">${points}</form>
                `;

                container.appendChild(row);
            }
        });
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

// --- STEP D: Event Listeners ---
window.addEventListener('DOMContentLoaded', () => {
    const picker = document.getElementById('season-select');
    
    // 1. Load the default selected season immediately
    if (picker) {
        loadLeaderboard(picker.value);

        // 2. Listen for changes on the dropdown
        picker.addEventListener('change', function() {
            loadLeaderboard(this.value);
        });
    }
});