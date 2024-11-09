# Flask imports 
from flask import Flask, render_template

# sqlalchemy wrapper imports 
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# utility imports 
import os 
from dotenv import load_dotenv
load_dotenv()

# helper file imports 
from datamodel import initializeDatabase
from helper import populateCollectionSet, populateCardTable, dropAllTable

# Configure our app values and where the app should be looking for different resources
app = Flask(__name__, template_folder='templates', static_folder='static')

# database engine connecting to which file 
engine = create_engine('sqlite:///pokedb.db', echo=True)    # echo = false will not display queries in the terminal

#* Will determine whether or not we actually need a session in real world application 
Session = sessionmaker(bind=engine)
dbSession = Session()

# Initialize the database connection
initializeDatabase(engine)

# Testing landing page route
# @app.route('/')
# def loadLandingPage(): 
#     return render_template('index.html')


if __name__ == '__main__': 
    # populateCollectionSet('Sheet1.csv', dbSession)
    populateCardTable('SheetMaster.csv', dbSession)
    # populateCardTable('Sheet3.csv', dbSession)

    # dropAllTable(dbSession)
    
    # app.run(port=5500)