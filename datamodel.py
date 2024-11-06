from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Define the 'Card' table
class Card(Base):
    __tablename__ = 'card'

    card_id = Column(Integer, primary_key=True)
    card_name = Column(String(100), nullable=False)
    collection_set = Column(String(100))
    rarity = Column(String(20))
    picture_url = Column(Text)
    hit_points = Column(Integer)
    card_type = Column(String(50))
    holo_rating = Column(String(50))
    energy_required = Column(String(100))
    ability = Column(String(100), nullable=True)
    ability_description = Column(String(100), nullable=True)
    attack_name = Column(String(100))
    attack_damage = Column(String(50))
    attack_description = Column(String(50), nullable=True)
    attack_name2 = Column(String(100), nullable=True)
    attack_damage2 = Column(String(50), nullable=True)
    attack_description2 = Column(String(50), nullable=True)
    weakness = Column(String(100))
    retreat_cost = Column(String(50))

# Define the 'CollectionSet' table
class CollectionSet(Base):
    __tablename__ = 'collection_set'

    set_id = Column(Integer, primary_key=True)
    collection_name = Column(String(100), unique=True, nullable=False)
    cover_art = Column(String(100))
    image_url = Column(Text)