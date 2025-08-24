import { useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

export default function ClusterMap({ campgrounds, apiKey }) {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        if (map.current || !apiKey) return;

        maptilersdk.config.apiKey = apiKey;

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.BRIGHT,
            center: [-103.59179687498357, 40.66995747013945],
            zoom: 3
        });


        map.current.on("load", () => {
            map.current.addSource("campgrounds", {
                type: "geojson",
                data: campgrounds,
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50
            });

            map.current.addLayer({
                id: "clusters",
                type: "circle",
                source: "campgrounds",
                filter: ["has", "point_count"],
                paint: {
                    "circle-color": [
                        "step",
                        ["get", "point_count"],
                        "#00BCD4",
                        10,
                        "#2196F3",
                        30,
                        "#3F51B5"
                    ],
                    "circle-radius": [
                        "step",
                        ["get", "point_count"],
                        15,
                        10,
                        20,
                        30,
                        25
                    ]
                }
            });

            map.current.addLayer({
                id: "cluster-count",
                type: "symbol",
                source: "campgrounds",
                filter: ["has", "point_count"],
                layout: {
                    "text-field": "{point_count_abbreviated}",
                    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                    "text-size": 12
                }
            });

            map.current.addLayer({
                id: "unclustered-point",
                type: "circle",
                source: "campgrounds",
                filter: ["!", ["has", "point_count"]],
                paint: {
                    "circle-color": "#11b4da",
                    "circle-radius": 4,
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#fff"
                }
            });


            map.current.on("click", "clusters", async (e) => {
                const features = map.current.queryRenderedFeatures(e.point, {
                    layers: ["clusters"]
                });
                const clusterId = features[0].properties.cluster_id;
                const zoom = await map.current.getSource("campgrounds").getClusterExpansionZoom(clusterId);
                map.current.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom
                });
            });

            map.current.on("click", "unclustered-point", function (e) {
                const { popUpMarkup } = e.features[0].properties;
                const coordinates = e.features[0].geometry.coordinates.slice();

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                new maptilersdk.Popup()
                    .setLngLat(coordinates)
                    .setHTML(popUpMarkup)
                    .addTo(map.current);
            });

            map.current.on("mouseenter", "clusters", () => {
                map.current.getCanvas().style.cursor = "pointer";
            });
            map.current.on("mouseleave", "clusters", () => {
                map.current.getCanvas().style.cursor = "";
            });
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };

    }, [campgrounds, apiKey]);

    return (
        <div
            ref={mapContainer}
            style={{ width: "100%", height: "500px", borderRadius: "10px" }}
        />
    );
}






// import { useEffect, useRef } from "react";
// import * as maptilersdk from "@maptiler/sdk";
// import "@maptiler/sdk/dist/maptiler-sdk.css";

// export default function ClusterMap({ campgrounds, apiKey }) {
//     const mapContainer = useRef(null);

//     useEffect(() => {
//         maptilersdk.config.apiKey = apiKey;

//         const map = new maptilersdk.Map({
//             container: mapContainer.current,
//             style: maptilersdk.MapStyle.BRIGHT,
//             center: [-103.59179687498357, 40.66995747013945],
//             zoom: 3
//         });

//         map.on("load", function () {
//             map.addSource("campgrounds", {
//                 type: "geojson",
//                 data: campgrounds, // כאן צריך לשלוח GeoJSON תקין
//                 cluster: true,
//                 clusterMaxZoom: 14,
//                 clusterRadius: 50
//             });

//             map.addLayer({
//                 id: "clusters",
//                 type: "circle",
//                 source: "campgrounds",
//                 filter: ["has", "point_count"],
//                 paint: {
//                     "circle-color": [
//                         "step",
//                         ["get", "point_count"],
//                         "#00BCD4",
//                         10,
//                         "#2196F3",
//                         30,
//                         "#3F51B5"
//                     ],
//                     "circle-radius": [
//                         "step",
//                         ["get", "point_count"],
//                         15,
//                         10,
//                         20,
//                         30,
//                         25
//                     ]
//                 }
//             });

//             map.addLayer({
//                 id: "cluster-count",
//                 type: "symbol",
//                 source: "campgrounds",
//                 filter: ["has", "point_count"],
//                 layout: {
//                     "text-field": "{point_count_abbreviated}",
//                     "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
//                     "text-size": 12
//                 }
//             });

//             map.addLayer({
//                 id: "unclustered-point",
//                 type: "circle",
//                 source: "campgrounds",
//                 filter: ["!", ["has", "point_count"]],
//                 paint: {
//                     "circle-color": "#11b4da",
//                     "circle-radius": 4,
//                     "circle-stroke-width": 1,
//                     "circle-stroke-color": "#fff"
//                 }
//             });

//             map.on("click", "clusters", async (e) => {
//                 const features = map.queryRenderedFeatures(e.point, {
//                     layers: ["clusters"]
//                 });
//                 const clusterId = features[0].properties.cluster_id;
//                 const zoom = await map.getSource("campgrounds").getClusterExpansionZoom(clusterId);
//                 map.easeTo({
//                     center: features[0].geometry.coordinates,
//                     zoom
//                 });
//             });

//             map.on("click", "unclustered-point", function (e) {
//                 const { popUpMarkup } = e.features[0].properties;
//                 const coordinates = e.features[0].geometry.coordinates.slice();

//                 while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//                     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//                 }

//                 new maptilersdk.Popup()
//                     .setLngLat(coordinates)
//                     .setHTML(popUpMarkup)
//                     .addTo(map);
//             });

//             map.on("mouseenter", "clusters", () => {
//                 map.getCanvas().style.cursor = "pointer";
//             });
//             map.on("mouseleave", "clusters", () => {
//                 map.getCanvas().style.cursor = "";
//             });
//         });

//         return () => map.remove();
//     }, [campgrounds, apiKey]);

//     return (
//         <div
//             ref={mapContainer}
//             style={{ width: "100%", height: "500px", borderRadius: "10px" }}
//         />
//     );
//}
