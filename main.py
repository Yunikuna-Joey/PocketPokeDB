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

app = Flask(__name__, template_folder='templates', static_folder='static')

engine = create_engine('sqlite:///pokedb.db', echo=True)

#* Will determine whether or not we actually need a session in real world application 
Session = sessionmaker(bind=engine)
databaseSession = Session()

initializeDatabase(engine)

# Testing landing page route
@app.route('/')
def loadLandingPage(): 
    return render_template('index.html')