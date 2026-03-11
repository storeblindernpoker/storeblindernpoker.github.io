import header as h

from season import Season

"""
Ok here comes a rundown on how the system works:

The system splits everything into n weeks. Within said week, we store information about who played that week, who won, who lost, etc.
The week class stores a list of player classes, which hold information about the players. 
"""

inputDirectory  = "Inputs/"
outputDirectory = "Outputs/"

currentSeason   = "Spring 2026" 
seasonDirectory = currentSeason + "/"

# This creates a new season object, reads all games, and computes player stats
s = Season(inputDirectory,outputDirectory,seasonDirectory)

# Short code that writes to a file
outputFileDirectory = outputDirectory + seasonDirectory + "current_leaderboard.txt"
players = list(reversed(s.getSeasonPlayers()))

with open ("current_leaderboard.txt", "w",encoding="UTF-8") as file:

    file.write(f"{'name':30}, {'pseudonym':30}, {'current points':30}, {'highest points':30}, {'lowest points':30}\n")

    for p in players:
        file.write(f"{p.name:30}, {p.pseudonym:30}, {p.currentPoints:30}, {p.highestPoints:30}, {p.lowestPoints:30}\n")

# Printing stats for last game:
print(f"\nNumber of players: {s.getNumPlayers(-1)}")
print(f"Total Returns: {s.getReturns(-1)}")
print(f"Winner: {s.getWinner(-1)[0].pseudonym}, who had difference of {s.getWinner(-1)[1]} points.")
print(f"Loser: {s.getLoser(-1)[0].pseudonym}, who had difference of {s.getLoser(-1)[1]} points.")

# Stats test:

# Finding william
willID = s.getPlayerID("Whiskey")
# Getting stats
willProgression = s.getPlayerPoints(willID)
# Plotting
h.plt.plot(range(1,len(willProgression)+1),willProgression)
h.plt.xlabel("Night")
h.plt.ylabel("Points")
h.plt.title("Points progression for player Whiskey")
h.plt.show()