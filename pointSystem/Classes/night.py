import header as h

from player import Player,nullPlayer
from game   import Game

class Night:

    def __init__(self,allPlayers,seasonPlayers,nightString):

        # Keeping track of players
        self.allPlayers    = allPlayers    # All players that have ever played
        self.seasonPlayers = seasonPlayers # All players that have played this season (so far)
        self.newPlayers    = []            # All players that played their first game today

        # Keeping track of the best and worst player of this entire night
        self.bestPlayer   = nullPlayer
        self.bestDiff     = 0
        self.worstPlayer  = nullPlayer
        self.worstDiff    = 0
    
        # Keeping track of deviation from the total
        self.deviation    = 0

        # Keeping track of point sources not from the games
        self.jobs = []

        # Decoding nightstring. This also sets assemblyPrize and date,
        # along with running all games.
        self.decodeNightString(nightString)

        # Getting stats
        self.getStats()

        # Note that since this is an init method, seasonPlayers must be updated outside this class.
        # This is no magic though :)

    def decodeNightString(self,nightString):

        """
        Method that decodes the "night string" which is a string containg info about an entire night.
        This string is separated by \\n characters.
        The first line contains any information about the night (assembly prize, date, etc).
        All other lines are players, with a blank line with only a * signaling a new table.
        """

        # Getting all lines
        lines = nightString.strip("\n").split("\n")

        # Reading the first line
        firstWords         = lines[0].split(",")
        self.assemblyPrize = int(firstWords[0].replace("Assembly:","").strip(" ")) # The assembly prize is the first element
        self.date          = firstWords[1].replace("Date:","").strip(" ")          # The date is the second element

        # Reading the remaining lines
        self.games = [Game()]

        for i in range(1,len(lines)):
            l = lines[i]

            # If we find a + we move on to jobs :)
            if l.strip(" ") == "+":

                # Running final game
                self.games[-1].runGame()

                # Looping over remaining lines and getting jobs
                for j in range(i+1,len(lines)):
                    jobLines = lines[j].split(",")
                    newJob = [jobLines[0],jobLines[1],int(jobLines[2])]
                    self.jobs.append(newJob)
                break

            # If we find a *, we move onto the next game
            if l.strip(" ") == "*":

                # Running the game
                self.games[-1].runGame()
                # Rare instance of actually wanting to use the != operator!
                # We want to compare pointers here, not string contents
                if(i+1 != len(lines)):
                    # Moving to the next game
                    self.games.append(Game())

                continue

            """
            The remaining lines have the following format:
            Name, Pseudonym, InitialBet, Rebuy, Return 
            Note that the return will include the initial bet and the rebuy.
            """
            words = l.split(",") 

            name       = words[0].strip(" ")
            pseudonym  = words[1].strip(" ")

            # Before doing any more work, let's check if this player even exists:
            player = self.getPlayer(name,pseudonym)
            if player == nullPlayer:
                h.w.warn(f"The player {name} with pseudonym {pseudonym} could not be found!")
                """ Add error for remembering to add players and writing correctly """
                print()
                return

            # We have now proven that this player exists. Let's get it's stats!
            initialBet = int(words[2].strip(" "))
            rebuy      = int(words[3].strip(" "))
            returns    = int(words[4].strip(" "))

            self.games[-1].addPlayer(player)
            self.games[-1].addBet(initialBet + rebuy)
            self.games[-1].addReturn(returns)

    def getPlayer(self, name, pseudonym):
        
        for p in self.allPlayers:
            if(p.isPlayer(name,pseudonym)):
                return p
            
        return nullPlayer

        for p in self.allPlayers:
            print(f"name      : {p.name:30}, input : {name:30}")
            print(f"pseudonym : {p.pseudonym:30}, input : {pseudonym:30}\n")

        return nullPlayer

    def getStats(self):

        """
        Ok now we have all the games, and they've done their stuff. Time to calculate some stats! 
        Firstly, we want to find out which players actually played tonight. We will separate allPlayers into players and nonPlayers.
        Then we will calculate the total winner of this night.
        """

        """ Getting all players and non players """

        self.players = []
        self.nonPlayers = []

        # Looping over all games, and adding the players
        for g in self.games:
            self.players += g.players

        # In case not all players played today
        for j in self.jobs:
            player = self.getPlayer(j[0],j[1])
            if player not in self.players:
                self.players.append(player)

        # Looping over all players, and adding the ones that we haven't got already
        for p in self.allPlayers:
            if p not in self.players:
                self.nonPlayers.append(p)

        """ Operating on all players and non players: """

        # Adding all previously unseen players to seasonPlayers
        for p in self.players:
            if p not in self.seasonPlayers:
                self.newPlayers.append(p)

        # TEMP: Adding assembly prize (Technically this should happen before play but who cares)
        for p in self.players:
            p.addPoints(self.assemblyPrize + 500 *(p.numGames-1))

        """ Storing current player stats"""

        # Points before night
        self.currentPointsBefore = [h.initialPoints] * len(self.allPlayers)
        self.highestPointsBefore = [h.initialPoints] * len(self.allPlayers)
        self.lowestPointsBefore  = [h.initialPoints] * len(self.allPlayers)
        # Points after night
        self.currentPointsAfter  = [h.initialPoints] * len(self.allPlayers)
        self.highestPointsAfter  = [h.initialPoints] * len(self.allPlayers)
        self.lowestPointsAfter   = [h.initialPoints] * len(self.allPlayers)
        # Bets made this night
        self.bets                = [h.initialPoints] * len(self.allPlayers)
        # Returns gained this night
        self.returns             = [h.initialPoints] * len(self.allPlayers)
        # Differences this night
        self.pointDiffs          = [h.initialPoints] * len(self.allPlayers)

        # Looping over all games, and all players
        for g in self.games:
            for i in range(len(g.players)):

                # Getting player index (used in all lists within Game)
                playerIndex = i
                # Getting player ID (used in all lists within Night)
                playerID    = g.players[playerIndex].ID

                """ Insert error here for remembering to add * """

                # Updating stats, using the ID to index lists in this class, and the Index to index lists in g
                self.currentPointsBefore[playerID] = g.currentPointsBefore[playerIndex]
                self.highestPointsBefore[playerID] = g.highestPointsBefore[playerIndex]
                self.lowestPointsBefore[playerID]  = g.lowestPointsBefore[playerIndex]
                self.currentPointsAfter[playerID]  = g.currentPointsAfter[playerIndex]
                self.highestPointsAfter[playerID]  = g.highestPointsAfter[playerIndex]
                self.lowestPointsAfter[playerID]   = g.lowestPointsAfter[playerIndex]
                self.bets[playerID]                = g.bets[playerIndex]
                self.returns[playerID]             = g.returns[playerIndex]
                self.pointDiffs[playerID]          = g.returns[playerIndex] - g.bets[playerIndex]

        # Looping over all non-players to update their stats:
        for p in self.nonPlayers:

            playerID = p.ID

            self.currentPointsBefore[playerID] = p.currentPoints
            self.highestPointsBefore[playerID] = p.highestPoints
            self.lowestPointsBefore[playerID]  = p.lowestPoints 
            self.currentPointsAfter[playerID]  = p.currentPoints
            self.highestPointsAfter[playerID]  = p.highestPoints
            self.lowestPointsAfter[playerID]   = p.lowestPoints
            self.bets[playerID]                = 0
            self.returns[playerID]             = 0
            self.pointDiffs[playerID]          = 0

        """ Finding total winner and total loser: """

        for g in self.games:

            # Updating best and worst player
            if(g.bestDiff > self.bestDiff):
                self.bestDiff   = g.bestDiff
                self.bestPlayer = g.bestPlayer

            if(g.worstDiff < self.worstDiff):
                self.worstDiff   = g.worstDiff
                self.worstPlayer = g.worstPlayer
        
        """ Finding deviation """
        self.deviation = sum(self.returns) - sum(self.bets)

        """ Calculating  jobs """
        for j in self.jobs:
            # Adding job points
            p = self.getPlayer(j[0],j[1])
            p.addPoints(j[2])
            # Fixing stats
            playerID = p.ID
            self.lowestPointsBefore[playerID]  = p.lowestPoints 
            self.currentPointsAfter[playerID]  = p.currentPoints
            self.highestPointsAfter[playerID]  = p.highestPoints
            self.pointDiffs[playerID]          = p.currentPoints - self.currentPointsBefore[playerID]

