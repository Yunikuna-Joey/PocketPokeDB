import { Link } from 'react-router-dom'

export const CardPackTile = ({ boosterPack }) => { 
    // This individual component should have just the name of collection and picture of the collection 

    return ( 
        <div className="booster-pack-tile">
            <img 
                src={boosterPack.coverArt}
                alt={boosterPack.collectionName}
                className="booster-pack-image"
            />

            <h3> 
                <Link to={`/cardpackinfo/${boosterPack.collectionName}/${boosterPack.id}`}>
                    {boosterPack.collectionName}
                </Link>
            </h3>
        </div>
    )
}