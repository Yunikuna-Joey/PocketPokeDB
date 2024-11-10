import csv 

from datamodel import CollectionSet, Card

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

def dropAllTable(databaseSession): 
    databaseSession.query(Card).delete()
    databaseSession.commit()
    print('Ran drop Card-table function.')