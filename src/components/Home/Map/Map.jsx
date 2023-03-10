import React, { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { googleMapStyle } from './MapStyle'
import axios from 'axios'

const mapOptions = {
  streetViewControl: false,
  fullscreenControl: false,
  mapTypeControl: false,
  zoomControl: true,
  styles: googleMapStyle,
};

const markerOptions = {
  icon: {
    // url: 'https://example.com/custom-marker.png',
    scaledSize: { width: 50, height: 50 }
  }
};

function Map() {

  const [mapData, setMapData] = useState([])
  const [isMapDataLoading, setIUsMapDataLoading] = useState(false)

  useEffect(() => {
    countries()
  }, [])

  const countries = async () => {
    try {
      setIUsMapDataLoading(true)
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/leaks/countries`;
      const response = await axios.get(endpoint);
      if (response && response.status === 200) {
        const payload = response.data
        console.log('payload', payload)
        setMapData(payload)
      }
      setIUsMapDataLoading(false)
    } catch (error) {
      console.log("ERROR while fetching leaks data from API ", error);
      setIUsMapDataLoading(false)
      setMapData([]);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAlSTMjfsA49Sw0bb9lpcpXxon-fsTVKDE"
    >
      <GoogleMap
        mapContainerStyle={{ height: '60vh', width: '100%' }}
        options={mapOptions}
        zoom={3}
        center={{ lat: 21.287934, lng: 37.790933 }}
      >
        {mapData && mapData.map((marker, index) => (
          <Marker
            options={markerOptions}
            key={index}
            position={{ lat: marker.homelat, lng: marker.homelon }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  )
}

export default Map