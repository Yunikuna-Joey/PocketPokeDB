# Flask imports 
from flask import Flask, render_template, jsonify, request, url_for
# from flask_cors import CORS

# sqlalchemy wrapper imports 
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, joinedload

# utility imports 
import os 
from dotenv import load_dotenv
load_dotenv()

# helper file imports 
from datamodel import Card, initializeDatabase, Event, CollectionSet, FamilySet 
from helper import dropCollectionTable, dropEventTable, dropFamilySet, populateCollectionSet, populateCardTable, dropCardTable, populateEventTable, populateFamilySetTable

# Configure our app values and where the app should be looking for different resources
app = Flask(__name__, template_folder='templates', static_folder='static')

# determine if this will work or we can always get rid of it [This is supposed to allow communication between react / flask]
# CORS(app)

# database engine connecting to which file 
engine = create_engine('sqlite:///pokedb.db', echo=False)    # echo = false will not display queries in the terminal

#* Will determine whether or not we actually need a session in real world application 
Session = sessionmaker(bind=engine)
dbSession = Session()

# Initialize the database connection
initializeDatabase(engine)

@app.route('/')
def loadHomepage(): 
    """
    This will be a placeholder home page 
    """
    return render_template('index.html')

# Testing landing page route [events tab]
@app.route('/eventPage')
def loadLandingPage(): 
    """
    This endpoint will query the database for the current events list stored in the database and return in json format the necessary information 
    """

    #* Query the database for all of the events in the databse 
    eventList = dbSession.query(Event).all()

    #* Iterate through all of the queried events and perform the json format on each 
    formatList = [event.formatJson() for event in eventList]

    for event in formatList:
        event['eventCoverArt'] = url_for('static', filename=f'images/events/{event["eventCoverArt"]}')

    return jsonify(formatList)

#* This endpoint will be used to query booster pack information 
@app.route('/packPage')
def requestAllPackInfo(): 

    #* Query the database for all of the booster packs in the db 
    packList = dbSession.query(FamilySet).all()

    #* Iterate through all of the queried pack information and format into json object 
    formatPackList = [pack.fSetFormatJson() for pack in packList]

    for pack in formatPackList: 
        pack['coverArt'] = url_for('static', filename=f'images/boosterpacks/{pack["coverArt"]}')

    return jsonify(formatPackList)

@app.route('/subpackinfo/<int:baseSetId>')
def requestSubPackInfo(baseSetId): 
    # Retrieve pagination parameters from URL
    page = request.args.get('page', 1, type=int)
    pageSize = request.args.get('page_size', 20, type=int)

    # utilize the id to query the collectionSet table
    basePokemonCoverPacks = dbSession.query(CollectionSet).filter(CollectionSet.familySetId == baseSetId).all()         # this variable holds the data rows/entries so we must format to utilize the bits and pieces

    collectionSetIdList = [pack.setId for pack in basePokemonCoverPacks]                                                # creates a list that holds all of the pack ids for a specific base/family set

    # allCards = dbSession.query(Card).filter(Card.collectionSetId.in_(collectionSetIdList)).all()                        # gathers all of the cards that match the boosterPackId into a list of Card Objects
    allCards = dbSession.query(Card).filter(Card.collectionSetId.in_(collectionSetIdList)).offset((page - 1) * pageSize).limit(pageSize).all()

    cardJsonData = [card.cardFormatJson() for card in allCards]                                                         # json data for all of the cards queried with the setId data

    for card in cardJsonData: 
        card['coverArt'] = url_for('static', filename=f'images/cards/{card["coverArt"]}')

    return jsonify(cardJsonData)

@app.route('/requestFilteredInfo/<int:baseSetId>')
def requestFilteredInfo(baseSetId): 
    #***********************************************************************
    #* This endpoint will grab card data page by page
    #* The filter options should be encapsulated in lists so that we can take advantage of the sql in_ method to grab the necessary data
    #* look at optionList2 to determine how to create the connection from baseSetId --> Card collectionSetId
    #* then from the above card entries, sort and return by the filter applied from the front-end 
    page = request.args.get('page', 1, type=int)
    pageSize = request.args.get('page_size', 20, type=int)

    optionList1 = request.args.get('pokemonCover')
    optionList2 = request.args.get('rarity')

    # determine if we are working with multiple
    if "," in optionList1: 
        optionList1 = optionList1.split(',')
        collectionSetIdList = dbSession.query(CollectionSet.setId).filter(
            CollectionSet.pokemonCover.in_(optionList1)
        ).all()
        collectionSetIdList = [ pack.setId for pack in collectionSetIdList ]
        optionList1 = collectionSetIdList

    else: 
        optionList1 = [optionList1]
        collectionSetIdList = dbSession.query(CollectionSet.setId).filter(
            CollectionSet.pokemonCover.in_(optionList1)
        ).all()
        collectionSetIdList = [ pack.setId for pack in collectionSetIdList ]
        optionList1 = collectionSetIdList

    #* The case for multiple rarities chosen to filter
    if "," in optionList2: 
        optionList2 = optionList2.split(',')

    #* The case for no filter chosen 
    elif optionList2 == "": 
        # make a query on collection set and gather the ids of collection set 
        collectionSetList = dbSession.query(CollectionSet).filter(CollectionSet.familySetId == baseSetId).all()

        # from the entries returned from the query above, extract the id's 
        collectionSetIdList = [ subpack.setId for subpack in collectionSetList]

        # make a query on the Card table to grab all of the unique rarities to be returned as options [returns a tuple]
        rarityList = dbSession.query(Card.rarity).filter(Card.collectionSetId.in_(collectionSetIdList)).distinct().all()

        # format the list to retrieve the first element from the tuple 
        optionList2 = [rarity[0] for rarity in rarityList]

    #* The case for only one option chosen
    else: 
        optionList2 = [optionList2]

    # gathers all of the card data with the filters
    query = dbSession.query(Card).filter(
        Card.collectionSetId.in_(optionList1),
        Card.rarity.in_(optionList2)
    ).offset((page - 1) * pageSize).limit(pageSize).all()

    # serialize before sending to the front-end 
    cardJsonData = [ card.cardFormatJson() for card in query]

    # replace with the file path for the images
    for card in cardJsonData: 
        card['coverArt'] = url_for('static', filename=f'images/cards/{card["coverArt"]}')

    return jsonify(cardJsonData)


# This will provide the filters for determining cards from each pack
@app.route('/populateOptionList1/<int:baseSetId>')
def populateOptionList1(baseSetId):
    try:  
        # make a query to the CollectionSet table to gather all of the possible subpacks that can be filtered with
        subCollectionPacks = dbSession.query(CollectionSet).filter(CollectionSet.familySetId == baseSetId).all()

        pokemonCoverList = [pack.pokemonCover for pack in subCollectionPacks]

        return jsonify(pokemonCoverList)

    except Exception as e: 
        print(f"Error on optionList1 endpoint {e}")

# This will provide the filters for the rarity of each card 
@app.route('/populateOptionList2/<int:baseSetId>')
def populateOptionList2(baseSetId): 
    try: 
        # make a query on collection set and gather the ids of collection set 
        collectionSetList = dbSession.query(CollectionSet).filter(CollectionSet.familySetId == baseSetId).all()

        # from the entries returned from the query above, extract the id's 
        collectionSetIdList = [ subpack.setId for subpack in collectionSetList]

        # make a query on the Card table to grab all of the unique rarities to be returned as options [returns a tuple]
        rarityList = dbSession.query(Card.rarity).filter(Card.collectionSetId.in_(collectionSetIdList)).distinct().all()

        # format the list to retrieve the first element from the tuple 
        rarityList = [rarity[0] for rarity in rarityList]

        return jsonify(rarityList)
    
    except Exception as e: 
        print(f"Error on optionList2 endpoint: {e}")

if __name__ == '__main__': 
    # dropCollectionTable(dbSession)
    # populateCollectionSet('Sheet1.csv', dbSession)
    # dropCardTable(dbSession)
    # populateCardTable('Sheet2.csv', dbSession)
    # populateEventTable('Sheet3.csv', dbSession)
    # populateFamilySetTable('Sheet4.csv', dbSession)

    # dropAllTable(dbSession)
    # dropEventTable(dbSession)
    # populateEventTable('Sheet3.csv', dbSession)

    # packs = dbSession.query(CollectionSet).filter(CollectionSet.familySetId == 1).all()
    # pokemonCoverList = [pack.pokemonCover for pack in packs] 
    
    # print(jsonify(pokemonCoverList))

    app.run(port=5500, debug=True)