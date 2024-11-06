# Flask imports 
from flask import Flask

# sqlalchemy wrapper imports 
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# utility imports 
import os 
from dotenv import load_dotenv
load_dotenv()

# helper file imports 
from datamodel import initializeDatabse


app = Flask(__name__)

engine = create_engine('sqlite:///pokedb.db', echo=True)

#* Will determine whether or not we actually need a session in real world application 
Session = sessionmaker(bind=engine)
databaseSession = Session()

initializeDatabse(engine)