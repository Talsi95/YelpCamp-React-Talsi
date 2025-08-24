import CampgroundCard from './CampgroundCard';
import ClusterMap from './ClusterMap';
import { useState, useEffect } from 'react';

export default function CampgroundList({ campgrounds, apiKey }) {
    const [geoJson, setGeoJson] = useState(null);

    useEffect(() => {
        const newGeoJson = {
            type: "FeatureCollection",
            features: campgrounds.map(camp => {

                const imageUrl = camp.images?.[0]?.url ||
                    "https://res.cloudinary.com/dlig7gqsb/image/upload/v1754990857/YelpCamp/nayue5rhsoxxzy51zwr6.jpg";

                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [
                            camp.geometry.coordinates[0],
                            camp.geometry.coordinates[1]
                        ]
                    },
                    properties: {
                        popUpMarkup: `
                            <div style="width:200px; font-family:sans-serif;">
                                <img src="${imageUrl}" alt="${camp.title}" style="width:100%; height:120px; object-fit:cover; border-radius:6px;" />
                                <h4 style="margin:8px 0; font-size:16px;">${camp.title}</h4>
                                <p style="margin:0; font-weight:bold; color:#28a745;">₪${camp.price}</p>
                                <a href="/campgrounds/${camp._id}" style="display:inline-block; margin-top:6px; padding:6px 10px; background:#007bff; color:#fff; text-decoration:none; border-radius:4px;">
                                    צפה בפרטים
                                </a>
                            </div>
                        `
                    }
                };
            })
        };
        setGeoJson(newGeoJson);
    }, [campgrounds]);

    if (!geoJson) {
        return <div>טוען נתוני מפה...</div>;
    }

    return (
        <>
            {apiKey && (
                <ClusterMap campgrounds={geoJson} apiKey={apiKey} />
            )}
            <div className="container mt-4">
                <div className="row">

                    {campgrounds.map(cg => (
                        <div className="col-md-4" key={cg._id}>
                            <CampgroundCard campground={cg} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
