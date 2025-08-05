import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
	width: '100%',
	height: '400px'
};

const center = {
	lat: -34.397,
	lng: 150.64
};

function SimpleMap() {
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: import.meta.env.VITE_MAP_KEY
	});

	return isLoaded ? (
		<GoogleMap
			mapContainerStyle={containerStyle}
			center={center}
			zoom={10}
		>
			<Marker position={center} />
		</GoogleMap>
	) : null;
}

export default SimpleMap;
