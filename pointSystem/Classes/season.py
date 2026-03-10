import header as h

from player import Player,nullPlayer
from game   import Game
from night  import Night

class Season:

    def __init__(self,inputDirectory,outputDirectory,seasonDirectory):

        """
        Class that represents an entire season of poker. This class contains a list of Nights, which
        represent a single friday of play.
        """

        # Storing directories
        self.inputDirectory  = inputDirectory
        self.outputDirectory = outputDirectory
        self.seasonDirectory = seasonDirectory

        self.seasonInputDirectory  = self.inputDirectory + self.seasonDirectory
        self.seasonOutputDirectory = self.outputDirectory + self.seasonDirectory

        self.allPlayers    = []
        self.seasonPlayers = []

        self.nights = []

        self.openFiles()

    def openFiles(self):

        self.readPlayers()
    
        self.readNights()

    def readPlayers(self):

        with open(self.inputDirectory + "PlayerInputs", encoding = "UTF-8") as inputFile:
            
            # The first line is nothing
            inputFile.readline()

            for l in inputFile:
                self.allPlayers.append(Player(l))

    def readNights(self):

        # Looping over all files in the input directory
        directory = h.os.fsencode(self.seasonInputDirectory)
        for fileBytes in h.os.listdir(directory):

            fileName = h.os.fsdecode(fileBytes)
            with open(self.seasonInputDirectory + fileName, encoding = "UTF-8") as inputFile:

                nightString = ""

                for l in inputFile:
                    nightString += l
                
                # Creating and running night
                self.nights.append(Night(self.allPlayers,self.seasonPlayers,nightString))

                # Updating season players
                self.seasonPlayers += self.nights[-1].newPlayers


    """ Methods that return certain statistics: """    

    def getSeasonPlayers(self, sorted = True):

        """ Method that returns the players who played this season. """

        # Sorting (optional)
        if sorted == h.sortedConstant:
            h.sortPlayerList(self.seasonPlayers)
        
        # Returning unsorted
        return self.seasonPlayers

    def getPlayerPoints(self, playerID = 0, after = True, sorted = True):
        
        """ Method that returns a "timeline" of points for a given player """

        # List to store the points
        points = []

        # Looping over all nights
        for n in self.nights:

            # Getting the points for current night
            if after:
                points.append(n.currentPointsAfter[playerID])
            else:
                points.append(n.currentPointsBefore[playerID])
        
        # Sorting (optional)
        if sorted:
            h.sortNumberedList(points)

        return points

    def getPlayerHighestPoints(self, playerID = 0, after = True, sorted = True):
        
        """ Method that returns a "timeline" of highest points for a given player """

        # List to store the points
        points = []

        # Looping over all nights
        for n in self.nights:

            # Getting the points for current night
            if after:
                points.append(n.highestPointsAfter[playerID])
            else:
                points.append(n.highestPointsBefore[playerID])

        # Sorting (optional)
        if sorted:
            h.sortNumberedList(points)
        
        return points

    def getPlayerLowestPoints(self, playerID = 0, after = True, sorted = True):
        
        """ Method that returns a "timeline" of lowest points for a given player """

        # List to store the points
        points = []

        # Looping over all nights
        for n in self.nights:

            # Getting the points for current night
            if after:
                points.append(n.lowestPointsAfter[playerID])
            else:
                points.append(n.lowestPointsBefore[playerID])
        
        # Sorting (optional)
        if sorted:
            h.sortNumberedList(points)

        return points

    def getPlayerBets(self, playerID = 0, after = True, sorted = True):
        
        """ Method that returns a "timeline" of bets for a given player """

        # List to store the points
        points = []

        # Looping over all nights
        for n in self.nights:

            # Getting the points for current night
            if after:
                points.append(n.bets[playerID])
            else:
                points.append(n.bets[playerID])
        
        # Sorting (optional)
        if sorted:
            h.sortNumberedList(points)

        return points

    def getPlayerReturns(self, playerID = 0, after = True, sorted = True):
        
        """ Method that returns a "timeline" of returns for a given player """

        # List to store the points
        points = []

        # Looping over all nights
        for n in self.nights:

            # Getting the points for current night
            if after:
                points.append(n.returns[playerID])
            else:
                points.append(n.returns[playerID])

        # Sorting (optional)
        if sorted:
            h.sortNumberedList(points)
        
        return points

    def getPlayerDiffs(self, playerID = 0, after = True, sorted = True):
        
        """ Method that returns a "timeline" of diffs for a given player """

        # List to store the points
        points = []

        # Looping over all nights
        for n in self.nights:

            # Getting the points for current night
            if after:
                points.append(n.pointDiffs[playerID])
            else:
                points.append(n.pointDiffs[playerID])
        
        # Sorting (optional)
        if sorted:
            h.sortNumberedList(points)

        return points
    
    def getAllPlayerPoints(self, after = True, sorted = True):
        
        """ Method that returns a list of "timelines", containing the points for all players"""

        timelines = []

        for p in self.seasonPlayers:

            timelines.append(self.getPlayerPoints(p.ID,after,sorted))

        return timelines

    def getAllPlayerHighestPoints(self,after = True, sorted = True):
        
        """ Method that returns a list of "timelines", containing the highest points for all players"""

        timelines = []

        for p in self.seasonPlayers:

            timelines.append(self.getPlayerHighestPoints(p.ID,after,sorted))

        return timelines

    def getAllPlayerLowestPoints(self,after = True, sorted = True):
        
        """ Method that returns a list of "timelines", containing the lowest points for all players"""

        timelines = []

        for p in self.seasonPlayers:

            timelines.append(self.getPlayerLowestPoints(p.ID,after,sorted))

        return timelines

    def getAllPlayerBets(self,after = True, sorted = True):
        
        """ Method that returns a list of "timelines", containing bets for all players"""

        timelines = []

        for p in self.seasonPlayers:

            timelines.append(self.getPlayerBets(p.ID,after,sorted))

        return timelines

    def getAllPlayerReturns(self,after = True, sorted = True):
        
        """ Method that returns a list of "timelines", containing the returns for all players"""

        timelines = []

        for p in self.seasonPlayers:

            timelines.append(self.getPlayerReturns(p.ID,after,sorted))

        return timelines

    def getAllPlayerDiffs(self,after = True, sorted = True):
        
        """ Method that returns a list of "timelines", containing the diffs for all players"""

        timelines = []

        for p in self.seasonPlayers:

            timelines.append(self.getPlayerDiffs(p.ID,after,sorted))

        return timelines
    
    def getAttendance(self,nightIndex = 0, sorted = True):

        """ Method that returns the attendance for a given night. """

        attendance = self.nights[nightIndex].players

        if sorted:
            h.sortPlayerList(attendance)

        return attendance

    def getTotalAttendance(self, sorted = True):

        """ Method that returns a list of attendance lists. Each attendance list contains all players who played that night """

        # A list to contain our attendance lists
        attendanceLists = []

        for i in range(len(self.nights)):

            # Getting the attendance for this night
            attendanceLists.append(self.getAttendance(i,sorted))
        
        return attendanceLists

    def getAttendanceNumbers(self, sorted = True):

        """ Method that gets attendance numbers for all season players. """

        # Dictionary that contains the numbers
        attendanceNumbers = {}

        # Getting attendance (not sorted since we don't care)
        attendanceLists = self.getTotalAttendance(sorted = False)
        
        # Counting attendance using the classic dictionary method
        for l in attendanceLists:
            for p in l:

                if p.pseudonym in attendanceNumbers:
                    attendanceNumbers[p.pseudonym] += 1
                else:
                    attendanceNumbers[p.pseudonym] = 1

        if sorted:
            return h.sortDictionary(attendanceNumbers,h.numberComparison)
        else:
            return list(attendanceNumbers.keys()),list(attendanceNumbers.keys())
        
    def getPlayerID(self,pseudonym,name = "NAME"):
        for p in self.seasonPlayers:
            if(p.isPlayer(name,pseudonym)):
                return p.ID
        return 0

    def getNumPlayers(self,nightIndex = 0):
        return len(self.getAttendance(nightIndex))
    
    def getPot(self,nightIndex = 0):
        return(sum(self.nights[nightIndex].bets))

    def getReturns(self,nightIndex = 0):
        return(sum(self.nights[nightIndex].returns))
    
    def getWinner(self,nightIndex = 0):
        return self.nights[nightIndex].bestPlayer, self.nights[nightIndex].bestDiff
    
    def getLoser(self,nightIndex = 0):
        return self.nights[nightIndex].worstPlayer, self.nights[nightIndex].worstDiff