
"""
This file contains constants and functions that we want to use within the other programs
"""

""" Useful libraries: """

import warnings as w
import matplotlib.pyplot as plt
import os

""" Constants: """

# Number constants
initialPoints      = 40000 # The points every player begin the games with
unobtainablePoints = -1    # Points should in theory always be positive.
unsortedConstant   = 0
sortedConstant     = 1

# Name constants
nullPointsName         = "Null Profile"
nullPointsPseudonym    = "The Void"
surplusPointsName      = "Surplus Points"
surplusPointsPseudonym = "The Prize"
deficitPointsName      = "Deficit Points"
deficitPointsPseudonym = "The Punishment"
specialProfileJoinDate = "1970-01-01"

""" Useful functions """

def compareStrings(string1, string2):

    """ Function that compares two strings in all lowercase without spaces"""

    # Compares two strings lowercase without whitespace
    return string1.lower().replace(" ","") == string2.lower().replace(" ","")


# The following quicksort implementation is stolen from https://www.geeksforgeeks.org/dsa/python-program-for-quicksort/

def partition(arr, low, high, comp):

    # Selecting a pivot
    pivot = arr[high]
    i = low - 1

    # Partitioning
    for j in range(low, high):
        if comp(arr[j], pivot) <= 0:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]

    return i + 1

def quicksort(arr, low, high, comp):

    if low < high:
        p = partition(arr, low, high,comp)
        quicksort(arr, low, p - 1,comp)
        quicksort(arr, p + 1, high,comp)

""" Welcome to comparison hell: """
# Comparison function for a list of numbers
def numberComparison(num1, num2):
    if num1 < num2:
        return -1
    if num1 > num2:
        return 1
    return 0

# Comparison for players (current points)
playerComparison1 = lambda player1,player2 : numberComparison(player1.currentPoints,player2.currentPoints)
# Comparison for players (highest points)
playerComparison2 = lambda player1,player2 : numberComparison(player1.currentPoints,player2.currentPoints)
# Comparison for players (Lowest points)
playerComparison3 = lambda player1,player2 : numberComparison(player1.currentPoints,player2.currentPoints)
# Function that returns one of the comparisons
def playerComparison(comparisonType = 1):

    """ Function that returns a player comparison function.
    1 sorts by current points, 2 sorts by highest points, 3 by lowest points. """

    if comparisonType == 2:
        return playerComparison2
    if comparisonType == 3:
        return playerComparison3
    return playerComparison1

# Function that creates a comparison for dict keys
def keyComparison(d,comp):

    """ Function that generates a comparison function for the keys of a dict.
    the function will then compare the corresponding values. """

    def kc(key1,key2):

        return comp(d[key1],d[key2])
    
    return kc


""" Actual sorting functions: """

# Function that sorts a list of numbers
def sortNumberedList(arr):
    comp = numberComparison
    quicksort(arr,0,len(arr)-1,numberComparison)

# Function that sorts a list of players
def sortPlayerList(arr,comparisonType = 1):
    comp = playerComparison(comparisonType)
    quicksort(arr,0,len(arr)-1,comp)

def sortDictionary(d,comp):

    # Storing keys and values
    keys   = list(d.keys())
    values = list(d.values())

    # Sorting the values:
    quicksort(values,0,len(values)-1,comp)
    # Sorting the keys
    quicksort(keys,0,len(keys)-1,keyComparison(d,comp))

    return keys,values