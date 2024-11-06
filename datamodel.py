from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

# Define the 'Card' table
class Card(Base):
    __tablename__ = 'card'

    nationalDexId = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    # foreign key linking to the CollectionSet table 
    collectionSetId = Column(Integer, ForeignKey('collection_set.setId'), nullable=False)
    rarity = Column(String(20))
    coverArt = Column(String(255))         # This will hold the url of the image associated with the pokemon
    
    hitPoints = Column(Integer)
    energyType = Column(String(50))
    holoRating = Column(String(50)) # star1, star2, crown, etc
    energy_required = Column(String(100))

    # Not all cards have an ability, so these fields can be null, 
    ability = Column(String(100), nullable=True)
    ability_description = Column(String(100), nullable=True)

    # every pokemon is guaranteed to have one attack move
    attack_name = Column(String(100))
    attack_damage = Column(String(50))
    attack_description = Column(String(50), nullable=True)
    
    attack_name2 = Column(String(100), nullable=True)
    attack_damage2 = Column(String(50), nullable=True)
    attack_description2 = Column(String(50), nullable=True)
    
    weakness = Column(String(100))
    retreat_cost = Column(String(50))

    # This is for programatically establishing the relationship
    collectionSet = relationship('CollectionSet', back_populates='cards')

# Define the 'CollectionSet' table
class CollectionSet(Base):
    __tablename__ = 'collection_set'

    setId = Column(Integer, primary_key=True)
    collectionName = Column(String(100), nullable=False)                    # This will be the name of the booster pack [going to override 'unique=True' for now]
    pokemonCover = Column(String(100))                                      # This will represent the pokemon on the cover of the booster pack [name]
    coverArt = Column(String(255))                                           # This will represent a url containing the image of the booster pack i guess 

    # define a one-to-many relationship with the card class [progamatically establish a relationship]
    cards = relationship('Card', back_populates="collectionSet")

def initializeDatabase(engine): 
    Base.metadata.create_all(engine)