async function loadLeaderboard() {
    const container = document.getElementById('leaderboard-body');
    
    try {
        // 1. Fetch the text file
        const response = await fetch('assets/data/leaderBoards/leaderBoardSeason1V1');
        const data = await response.text();

        // 2. Split text into individual lines and loop through them
        const lines = data.trim().split('\n');

        lines.forEach(line => {
            // 3. Split each line by the comma
            const [change, rank, name, points] = line.split(',');

            if (change && rank && name && points) {
                // 4. Create the row div
                const row = document.createElement('div');
                row.className = 'lb-row';

                // 5. Construct the inner HTML
                row.innerHTML = `
                    <form class="form">${change}</form>
                    <form class="form">${rank}</form>
                    <form class="form">${name}</form>
                    <form class="form">${points}</form>
                `;

                // 6. Add the row to the container
                container.appendChild(row);
            }
        });
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

// Run the function when the page loads
window.addEventListener('DOMContentLoaded', loadLeaderboard);