import header as h

class Player:

    currentID = 0

    def __init__(self,playerString,ID = 0):

        """
        Class that represents a player. 
        A player has a name, a pseudonym, and a bunch of stats.
        """

        # Decoding the input string
        # This also sets the name, pseudonym, and date of arrival
        self.decodePlayerString(playerString)

        # Giving this player an ID (which is also their index)
        # This is either set (this is for the three special profiles), or created automatically
        if(ID == 0):
            self.ID = Player.currentID
            Player.currentID += 1
        else:
            self.ID = ID

        # The stats that store points for the player
        self.currentPoints = h.initialPoints
        self.highestPoints = self.currentPoints
        self.lowestPoints  = self.currentPoints 

        # Other stats go here (when I think of them ;) )
        self.numGames = 0
    
    def decodePlayerString(self,playerString):

        # The player string is separated by commas
        words = playerString.strip("\n").split(",")
        
        self.name = words[0].strip(" ")
        self.pseudonym = words[1].strip(" ")
        self.dateOfArrival = words[2].strip(" ")

    def isPlayer(self,name,pseudonym):

        return h.compareStrings(self.name,name) or h.compareStrings(self.pseudonym,pseudonym)

    def warn(self,message):
        h.w.warn(f"[Warning] : The player {self.name} with the pseudonym {self.pseudonym} {message}")
        print()

    
    def setPoints(self, newPoints, override = False):

        """
        Method that sets the current points of a profile. 
        """

        # Allowing for overriding all points (not widely used)
        if override:
            self.currentPoints = self.lowestPoints = self.highestPoints = newPoints
            return self
        
        # Updating points
        self.currentPoints = newPoints
        
        if(self.currentPoints < 0):
            self.warn("just had their points set below 0!")

        # Checking if highest points or lowest points must be adjusted
        if self.currentPoints > self.highestPoints:
            self.highestPoints = self.currentPoints

        if self.currentPoints < self.lowestPoints:
            self.lowestPoints = self.currentPoints

        return self
    
    def addPoints(self, diffPoints, override = False):

        """
        Method that adds a number of points to the current points. A negative addition is a subtraction (naturally)
        """

        # Updating points
        self.currentPoints += diffPoints

        if(self.currentPoints < 0 and not override):
            self.warn("just fell below 0 points!")
        
        # Checking if highest points or lowest points must be adjusted
        if self.currentPoints > self.highestPoints:
            self.highestPoints = self.currentPoints

        if self.currentPoints < self.lowestPoints:
            self.lowestPoints = self.currentPoints

        return self
    
    def addGame(self):
        self.numGames += 1

    
# Creating the three special players.
# Note that they all have negative IDs.
nullPlayer    = Player(f"{h.nullPointsName},{h.nullPointsPseudonym},{h.specialProfileJoinDate}",-1).setPoints(0,True)
surplusPlayer = Player(f"{h.surplusPointsName},{h.surplusPointsPseudonym},{h.specialProfileJoinDate}",-2).setPoints(0,True)
deficitPlayer = Player(f"{h.deficitPointsName},{h.deficitPointsPseudonym},{h.specialProfileJoinDate}",-3).setPoints(0,True)

""" The special profiles as they were defined the first season:

Base Profile,       The Void,       1970-01-01
Uncollected Points, The Prize,      1970-01-01
Lost Points,        The Punishment, 1970-01-01
"""