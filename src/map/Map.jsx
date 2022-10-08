import { Loader } from "@googlemaps/js-api-loader"
import { useRef, useEffect } from "react"

const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLEMAPS_API_KEY,
    version: "alpha",
    libraries: ["places"]
});

const mapOptions = {
    center: {
        lat: 35.6819677,
        lng: 139.7614256
    },
    zoom: 6
};

export const Map = ({ center, zoom }) => {
    const ref = useRef()
    useEffect(() => {
        loader
            .load()
            .then(google => {
                const map = new window.google.maps.Map(ref.current, mapOptions);
                const markerView = new google.maps.AdvancedMarkerView({
                    map,
                    position: mapOptions.center,
                    title: 'Google GWC2 Building',
                  });
                
            })
            .catch(e => {
                console.error(e)
            })


    }, [])
    return <div ref={ref} id="map" />
}
