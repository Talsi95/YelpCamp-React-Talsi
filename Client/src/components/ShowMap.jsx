// src/components/ShowMap.jsx
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

            // 🚨 הפתרון כאן: המתן לאירוע load של המפה
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
        // עדכן את המפה הקיימת
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




// import { useEffect, useRef } from "react";
// import * as maptilersdk from "@maptiler/sdk";
// import "@maptiler/sdk/dist/maptiler-sdk.css";

// export default function ShowMap({ campground, apiKey }) {
//     const mapContainer = useRef(null);

//     useEffect(() => {
//         const coords = campground?.geometry?.coordinates;
//         if (!apiKey || !coords || !Array.isArray(coords) || coords.length < 2) return;

//         let [a, b] = coords.map(Number);
//         const isLatLng = Math.abs(a) <= 90 && Math.abs(b) <= 180;
//         const center = isLatLng ? [b, a] : [a, b];

//         maptilersdk.config.apiKey = apiKey;

//         const map = new maptilersdk.Map({
//             container: mapContainer.current,
//             style: maptilersdk.MapStyle.BRIGHT,
//             center,
//             zoom: 10
//         });

//         new maptilersdk.Marker()
//             .setLngLat(center)
//             .setPopup(
//                 new maptilersdk.Popup({ offset: 25 }).setHTML(
//                     `<h3 style="margin:0">${campground.title}</h3><p style="margin:4px 0 0">${campground.location}</p>`
//                 )
//             )
//             .addTo(map);

//         return () => map.remove();
//     }, [campground, apiKey]);

//     return (
//         <div
//             ref={mapContainer}
//             style={{ width: "100%", height: "400px", borderRadius: "10px" }}
//         />
//     );
// }





// // import { useEffect, useRef } from "react";
// // import * as maptilersdk from "@maptiler/sdk";
// // import "@maptiler/sdk/dist/maptiler-sdk.css";

// // export default function ShowMap({ campground, apiKey }) {
// //     const mapContainer = useRef(null);

// //     useEffect(() => {
// //         if (!campground?.geometry?.coordinates) return;

// //         maptilersdk.config.apiKey = apiKey;

// //         const map = new maptilersdk.Map({
// //             container: mapContainer.current,
// //             style: maptilersdk.MapStyle.BRIGHT,
// //             center: campground.geometry.coordinates,
// //             zoom: 10
// //         });

// //         new maptilersdk.Marker()
// //             .setLngLat(campground.geometry.coordinates)
// //             .setPopup(
// //                 new maptilersdk.Popup({ offset: 25 })
// //                     .setHTML(
// //                         `<h3>${campground.title}</h3><p>${campground.location}</p>`
// //                     )
// //             )
// //             .addTo(map);

// //         return () => map.remove();
// //     }, [campground, apiKey]);

// //     return (
// //         <div
// //             ref={mapContainer}
// //             style={{ width: "100%", height: "400px", borderRadius: "10px" }}
// //         />
// //     );
// // }
