import { Loader } from "@googlemaps/js-api-loader"
import { useRef, useEffect, useState } from "react"
import * as turf from "@turf/turf"
import './Map.css'
import logo from './uniqlo.svg'

const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLEMAPS_API_KEY,
    libraries: ["places", "marker"]
});

const mapOptions = {
    center: {
        lat: 35.6819677,
        lng: 139.7614256
    },
    mapTypeControl: false,
    fullscreenControl: false,
    zoom: 6,
    mapId: '4504f8b37365c3d0',
};

export const Map = ({ details, setDetails }) => {
    const ref = useRef()
    const allMarkerRef = useRef([])
    const selectMarkerRef = useRef([])
    const polygonRef = useRef()
    const [map, setMap] = useState()

    useEffect(() => {
        loader
            .load()
            .then(google => {
                const map = new window.google.maps.Map(ref.current, mapOptions);

                fetch("http://localhost:3001/all")
                    .then(res => res.json())
                    .then(result => {
                        if (result && result.length > 0) {
                            result.map(p => {
                                const marker = new google.maps.marker.AdvancedMarkerElement({
                                    map,
                                    position: { lat: p.lat, lng: p.lng },
                                    // collisionBehavior: "OPTIONAL_AND_HIDES_LOWER_PRIORITY"
                                });
                                allMarkerRef.current.push(marker)
                            })

                        }
                    })

                map.addListener("click", (evt) => {
                    map.setCenter(evt.latLng)
                    map.setZoom(14)
                    if (polygonRef && polygonRef.current) {
                        polygonRef.current.setMap(null)
                        polygonRef.current = null
                    }
                    const pt = [evt.latLng.lng(), evt.latLng.lat()]
                    const polyCoord = turf.circle(pt, 1).geometry.coordinates[0]
                    const poly = polyCoord.map(p => ({
                        "lat": p[1],
                        "lng": p[0]
                    }))
                    polygonRef.current = new google.maps.Polygon({
                        paths: poly,
                        strokeColor: "#FF0000",
                        strokeOpacity: 0.3,
                        strokeWeight: 1,
                        fillColor: "#FF0000",
                        fillOpacity: 0.35,
                    });
                    polygonRef.current.setMap(map)

                    fetch(`http://localhost:3001/latlng?lat=${pt[1]}&lng=${pt[0]}`)
                        .then(res => res.json())
                        .then(result => {
                            if (selectMarkerRef && selectMarkerRef.current) {
                                selectMarkerRef.current.map(m => m.setMap(null))
                                selectMarkerRef.current = []
                            }
                            if (result && result.length > 0) {
                                result.map(p => {
                                    const marker = new google.maps.marker.AdvancedMarkerElement({
                                        map,
                                        position: { lat: p.lat, lng: p.lng },
                                        content: buildContent(p),
                                    });
                                    selectMarkerRef.current.push(marker)
                                })
                                
                            }
                            setDetails(result)
                        })
                });

                setMap(map)
            })
            .catch(e => {
                console.error(e)
            })


    }, []);

    return <div ref={ref} id="map" />
}

function buildContent(property) {
    const content = document.createElement("div");

    content.classList.add("property");
    content.innerHTML = `
      <div class="icon">
          <img src=${logo} height=30 width=30>
      </div>
      `;
    return content;
}
