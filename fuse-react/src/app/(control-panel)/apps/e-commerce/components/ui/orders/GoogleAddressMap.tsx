import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
	width: '100%',
	height: '400px'
};

type GoogleAddressMapProps = {
	center: {
		lat: number;
		lng: number;
	};
};

function GoogleAddressMap(props: GoogleAddressMapProps) {
	const { center } = props;
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

export default GoogleAddressMap;
