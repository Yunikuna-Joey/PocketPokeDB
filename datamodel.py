from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

# Define the 'Card' table
class Card(Base):
    __tablename__ = 'card'

    id = Column(Integer, primary_key=True)
    cardDexId = Column(Integer)
    name = Column(String(100), nullable=False)
    # foreign key linking to the CollectionSet table 
    collectionSetId = Column(Integer, ForeignKey('collection_set.setId'), nullable=False)
    rarity = Column(String(20))             # star1, star2, crown, etc
    coverArt = Column(String(255))         # This will hold the url of the image associated with the pokemon
    packPointValue = Column(Integer)
    
    hitPoints = Column(Integer)
    energyType = Column(String(50))

    # Not all cards have an ability, so these fields can be null, 
    ability = Column(String(100), nullable=True)
    abilityDescription = Column(String(100), nullable=True)

    # every pokemon is guaranteed to have one attack move
    attackName = Column(String(100))
    attackDamage = Column(Integer)
    attackDescription = Column(String(50), nullable=True)
    
    attackName2 = Column(String(100), nullable=True)
    attackDamage2 = Column(Integer, nullable=True)
    attackDescription2 = Column(String(50), nullable=True)
    
    weakness = Column(String(100))
    retreatCost = Column(Integer)

    # This is for programatically establishing the relationship
    collectionSet = relationship('CollectionSet', back_populates='cards')

# Define the 'CollectionSet' table
class CollectionSet(Base):
    __tablename__ = 'collection_set'

    setId = Column(Integer, primary_key=True)
    collectionName = Column(String(100), nullable=False)                    # This will be the name of the booster pack [going to override 'unique=True' for now]
    collectionId = Column(String(5))
    pokemonCover = Column(String(100))                                      # This will represent the pokemon on the cover of the booster pack [name]
    coverArt = Column(String(255))                                           # This will represent a url containing the image of the booster pack i guess 

    # define a one-to-many relationship with the card class [progamatically establish a relationship]
    cards = relationship('Card', back_populates="collectionSet")

def initializeDatabase(engine): 
    Base.metadata.create_all(engine)