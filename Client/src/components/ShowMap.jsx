import { useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

export default function ShowMap({ campground, apiKey }) {
    const mapContainer = useRef(null);
    const mapInstance = useRef(null);
    const markerInstance = useRef(null);

    useEffect(() => {
        if (!apiKey || !campground?.geometry?.coordinates) {
            return;
        }

        const coordinates = campground.geometry.coordinates;

        if (!mapInstance.current) {
            maptilersdk.config.apiKey = apiKey;
            mapInstance.current = new maptilersdk.Map({
                container: mapContainer.current,
                style: maptilersdk.MapStyle.BRIGHT,
                center: coordinates,
                zoom: 10
            });


            mapInstance.current.on('load', () => {
                const popup = new maptilersdk.Popup({ offset: 25 })
                    .setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>`);

                markerInstance.current = new maptilersdk.Marker({ color: "#FF0000" })
                    .setLngLat(coordinates)
                    .setPopup(popup)
                    .addTo(mapInstance.current);

                markerInstance.current.getPopup().addTo(mapInstance.current);
            });
        }

        else {
            if (markerInstance.current) {
                markerInstance.current.setLngLat(coordinates);
                markerInstance.current.getPopup().setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>`);
                mapInstance.current.flyTo({ center: coordinates, zoom: 10 });
            }
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
                markerInstance.current = null;
            }
        };
    }, [campground, apiKey]);

    return (
        <div
            ref={mapContainer}
            style={{ width: "100%", height: "400px", borderRadius: "10px" }}
        />
    );
}
