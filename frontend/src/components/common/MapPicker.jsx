import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];

const MapPicker = ({ onLocationSelect, initialLocation, initialLat = null, initialLng = null }) => {
  const [selectedLocation, setSelectedLocation] = useState({
    lat: initialLat || 37.7749,
    lng: initialLng || -122.4194,
    address: initialLocation || ''
  });
  const [autocomplete, setAutocomplete] = useState(null);
  const mapRef = useRef(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: libraries
  });

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
  };

  // Calculate center based on initial values or defaults
  const defaultCenter = useMemo(() => {
    if (initialLat && initialLng) {
      return { lat: initialLat, lng: initialLng };
    }
    if (selectedLocation.lat && selectedLocation.lng) {
      return { lat: selectedLocation.lat, lng: selectedLocation.lng };
    }
    return { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
  }, [initialLat, initialLng, selectedLocation.lat, selectedLocation.lng]);

  const handleMapClick = useCallback((e) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      setSelectedLocation({
        lat,
        lng,
        address: ''
      });

      // Reverse geocode to get address
      if (window.google && window.google.maps && window.google.maps.Geocoder) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address;
            setSelectedLocation(prev => ({
              ...prev,
              address
            }));
            if (onLocationSelect) {
              onLocationSelect({
                lat,
                lng,
                address
              });
            }
          } else {
            // If geocoding fails, still call onLocationSelect with coordinates
            if (onLocationSelect) {
              onLocationSelect({
                lat,
                lng,
                address: ''
              });
            }
          }
        });
      } else {
        // If geocoder is not available, still call onLocationSelect
        if (onLocationSelect) {
          onLocationSelect({
            lat,
            lng,
            address: ''
          });
        }
      }
    }
  }, [onLocationSelect]);

  const handlePlaceChanged = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name;

        setSelectedLocation({
          lat,
          lng,
          address
        });

        // Center map on selected place
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(15);
        }

        if (onLocationSelect) {
          onLocationSelect({
            lat,
            lng,
            address
          });
        }
      }
    }
  }, [autocomplete, onLocationSelect]);

  const onLoadMap = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onLoadAutocomplete = useCallback((autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  }, []);

  // Update selected location when initial values change (e.g., when editing an existing event)
  useEffect(() => {
    if (initialLat && initialLng) {
      setSelectedLocation({
        lat: initialLat,
        lng: initialLng,
        address: initialLocation || ''
      });
      // Center map on initial location if map is loaded
      if (mapRef.current) {
        mapRef.current.panTo({ lat: initialLat, lng: initialLng });
        mapRef.current.setZoom(15);
      }
    }
  }, [initialLat, initialLng, initialLocation]);

  if (!isLoaded) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Loading map...</p>
        {!apiKey && (
          <p className="text-red-500 ml-4">Please set VITE_GOOGLE_MAPS_API_KEY in your .env file</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Location
        </label>
        <Autocomplete
          onLoad={onLoadAutocomplete}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="Search for a location or click on the map"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            defaultValue={selectedLocation.address}
          />
        </Autocomplete>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Location on Map (Click to place marker)
        </label>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={initialLat && initialLng ? 15 : 10}
          onClick={handleMapClick}
          onLoad={onLoadMap}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true
          }}
        >
          {selectedLocation.lat && selectedLocation.lng && (
            <Marker
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
              animation={window.google?.maps?.Animation?.DROP}
            />
          )}
        </GoogleMap>
      </div>

      {selectedLocation.address && (
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600">Selected Address:</p>
          <p className="font-semibold text-purple-700">{selectedLocation.address}</p>
          <p className="text-xs text-gray-500 mt-1">
            Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapPicker;

