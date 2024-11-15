import csv 

from datamodel import CollectionSet, Card, Event
from datetime import datetime
from zoneinfo import ZoneInfo

# Function to fill in the collection table
def populateCollectionSet(fileName, databaseSession): 
    with open(fileName, mode='r', encoding='utf-8') as file: 
        # transform the csv file into a readable format 
        reader = csv.DictReader(file)

        # loop through each row and create a collection instance with the values
        for row in reader: 
            # create a new collection instance
            collection = CollectionSet(
                setId = row['setId'],
                collectionName = row['collectionName'], 
                collectionId = row['collectionId'], 
                pokemonCover = row['pokemonCover'] if row['pokemonCover'] else None, 
                coverArt = row['coverArt']
            )

            databaseSession.add(collection)
        
        databaseSession.commit()

# function to fill in the card table associated with different collections
def populateCardTable(fileName, databaseSession): 
    with open(fileName, mode='r', encoding='utf-8') as file: 
        reader = csv.DictReader(file)

        for row in reader: 
            card = Card(
                id = row['id'], 
                cardDexId = row['cardDexId'], 
                name = row['name'],
                collectionSetId = row['collectionSetId'], 
                rarity = row['rarity'], 
                coverArt = row['coverArt'], 
                packPointValue = row['packPointValue'],
                hitPoints = row['hitPoints'], 
                energyType = row['energyType'], 
                ability = row['ability'] if row['ability'] else None, 
                abilityDescription = row['abilityDescription'] if row['abilityDescription'] else None, 
                attackName = row['attackName'] if row['attackName'] else None, 
                attackDamage = row['attackDamage'] if row['attackDamage'] else None, 
                attackDescription = row['attackDescription'] if row['attackDescription'] else None, 
                attackName2 = row['attackName2'] if row['attackName2'] else None, 
                attackDamage2 = row['attackDamage2'] if row['attackDamage2'] else None, 
                attackDescription2 = row['attackDescription2'] if row['attackDescription2'] else None, 
                weakness = row['weakness'] if row['weakness'] else None,
                retreatCost = row['retreatCost'] if row['retreatCost'] else None
            )    

            databaseSession.add(card)
        
        databaseSession.commit()

def populateEventTable(fileName, databaseSession): 
    with open(fileName, mode="r", encoding="utf-8") as file: 
        reader = csv.DictReader(file)

        for row in reader: 
            event = Event( 
                id = row['id'], 
                eventCoverArt = row['eventCoverArt'] if row['eventCoverArt'] else None, 
                eventName = row['eventName'], 
                eventDescription = row['eventDescription'] if row['eventDescription'] else None,
                startTime = processNaturalTime(row['startTime']), 
                endTime = processNaturalTime(row['endTime'])
            )

            databaseSession.add(event)
        
        databaseSession.commit()

def processNaturalTime(timeString): 
    """
    ***Mainly used for processing dataset values into the data-tables.
    This will take in a string with the time format of something like 'month/day/year at 1:00PM' & return a utc version of the time string
    """

    # parse the strings into naive datetime objects [naive means there is no timezone attached to the string]
    naiveTimeObject = datetime.strptime(timeString, "%m/%d/%Y at %I:%M%p")

    # convert from naive to 
    pacificTimezone = ZoneInfo('America/Los_Angeles')
    pacificTimeObject = naiveTimeObject.replace(tzinfo=pacificTimezone)

    # convert from pacific to UTC [universal time]
    # universalTimeObject = pacificTimeObject.astimezone(ZoneInfo("UTC"))

    # return universalTimeObject
    return pacificTimeObject

def dropCardTable(databaseSession): 
    databaseSession.query(Card).delete()
    databaseSession.commit()
    print('Ran drop Card-table function.')

def dropEventTable(databaseSession): 
    databaseSession.query(Event).delete()
    databaseSession.commit()
    print('Ran the drop Event-table function')

def dropCollectionTable(databaseSession): 
    databaseSession.query(CollectionSet).delete()
    databaseSession.commit()
    print("Ran the drop Collection-table function")