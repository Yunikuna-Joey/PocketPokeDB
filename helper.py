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
                collectionId = row['collectionId'], 
                pokemonCover = row['pokemonCover'], 
                coverArt = row['coverArt']
            )

            databaseSession.add(collection)
        
        databaseSession.commit()

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
                hitPoints = row['hitPoints'], 
                energyType = row['energyType'], 
                energyRequired = row['energyRequired'], 
                ability = row['ability'], 
                abilityDescription = row['abilityDescription'], 
                attackName = row['attackName'], 
                attackDamage = row['attackDamage'], 
                attackDescription = row['attackDescription'], 
                attackName2 = row['attackName2'], 
                attackDamage2 = row['attackDamage2'], 
                attackDescription2 = row['attackDescription2'], 
                weakness = row['weakness'],
                retreatCost = row['retreatCost']
            )        

            databaseSession.add(card)
        
        databaseSession.commit()