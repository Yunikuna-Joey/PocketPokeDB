import csv 

from datamodel import CollectionSet, Card

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
                pokemonCover = row['pokemonCover'], 
                coverArt = row['coverArt']
            )

            databaseSession.add(collection)
        
        databaseSession.commit()
        