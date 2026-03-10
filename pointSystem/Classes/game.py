import header as h

from player import Player,nullPlayer

class Game:

    def __init__(self):

        """
        Class that represents a single poker game. This means a single table, not an entire night.

        Each game contains a list of players, how much those players bet, and how much they got back.
        A game also keeps track of the best player at that table, as well as the worst.
        """

        # The players taking part in this game
        self.players      = []
        # Points before game
        self.currentPointsBefore = []
        self.highestPointsBefore = []
        self.lowestPointsBefore  = []
        # Points after game
        self.currentPointsAfter = []
        self.highestPointsAfter = []
        self.lowestPointsAfter  = []
        # Bets this game
        self.bets         = []
        # Returns this game
        self.returns      = []
    
        # Caviat that future developers can implement if need be:
        # This system does nothing if there are multiple players who win (or lose). In practise this won't happen (or it's very unlikely)
        self.bestPlayer   = nullPlayer
        self.bestDiff     = 0
        self.worstPlayer  = nullPlayer
        self.worstDiff    = 0
    
    def addPlayer(self,newPlayer):
        
        # Checking if the player is in this game already
        if (newPlayer in self.players):
            h.w.warn(f"The player {newPlayer.name} with the pseudonym {newPlayer.pseudonym} is already taking part in this game!")
            return

        # Adding the player
        self.players.append(newPlayer)
        self.currentPointsBefore.append(newPlayer.currentPoints)
        self.highestPointsBefore.append(newPlayer.highestPoints)
        self.lowestPointsBefore.append(newPlayer.lowestPoints)
    
    def addBet(self,newBet):
        self.bets.append(newBet)
    
    def addReturn(self,newReturn):
        self.returns.append(newReturn) 

    def runGame(self):

        """
        Method that computes all the changes that happened at this specific table.
        It also computes who did the best out of all players, and who did the worst.
        """

        if not (len(self.players) == len(self.bets) == len(self.returns)):
            raise f"players : {len(self.players)} | bets : {len(self.bets)} | returns : {len(self.returns)}. These must be equal!"

        # Computing the changes that have happened to all players who played at this table
        for i in range(len(self.players)):

            p = self.players[i]
            b = self.bets[i]
            r = self.returns[i]

            p.addGame()

            # Calculating the change that has occured this game
            diff = (r - b) + (p.numGames * 500)
            # Adding this difference to the player
            p.addPoints(diff)
            # Updating the list of points after the game
            self.currentPointsAfter.append(p.currentPoints)
            self.highestPointsAfter.append(p.highestPoints)
            self.lowestPointsAfter.append(p.lowestPoints)

            # Updating best and worst player
            if(diff > self.bestDiff):
                self.bestDiff = diff
                self.bestPlayer = p

            if(diff < self.worstDiff):
                self.worstDiff = diff
                self.worstPlayer = p
        