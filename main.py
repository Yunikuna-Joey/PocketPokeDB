# Flask imports 
from flask import Flask, render_template, jsonify, request, url_for
# from flask_cors import CORS

# sqlalchemy wrapper imports 
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# utility imports 
import os 
from dotenv import load_dotenv
load_dotenv()

# helper file imports 
from datamodel import initializeDatabase, Event, CollectionSet, FamilySet 
from helper import dropCollectionTable, dropEventTable, populateCollectionSet, populateCardTable, dropCardTable, populateEventTable, populateFamilySetTable

# Configure our app values and where the app should be looking for different resources
app = Flask(__name__, template_folder='templates', static_folder='static')

# determine if this will work or we can always get rid of it [This is supposed to allow communication between react / flask]
# CORS(app)

# database engine connecting to which file 
engine = create_engine('sqlite:///pokedb.db', echo=True)    # echo = false will not display queries in the terminal

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
        event['eventCoverArt'] = url_for('static', filename=f'images/{event["eventCoverArt"]}')

    return jsonify(formatList)

#* This endpoint will be used to query booster pack information 
@app.route('/packPage')
def requestAllPackInfo(): 

    #* Query the database for all of the booster packs in the db 
    packList = dbSession.query(FamilySet).all()

    #* Iterate through all of the queried pack information and format into json object 
    formatPackList = [pack.fSetFormatJson() for pack in packList]

    for pack in formatPackList: 
        pack['coverArt'] = url_for('static', filename=f'images/{pack["coverArt"]}')

    return jsonify(formatPackList)


if __name__ == '__main__': 
    # populateCollectionSet('Sheet1.csv', dbSession)
    # populateCardTable('Sheet2.csv', dbSession)
    # populateEventTable('Sheet3.csv', dbSession)
    # populateFamilySetTable('Sheet4.csv', dbSession)

    # dropAllTable(dbSession)
    # dropEventTable(dbSession)
    # populateEventTable('Sheet3.csv', dbSession)    
    
    app.run(port=5500, debug=True)