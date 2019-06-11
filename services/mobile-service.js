import { Permissions, ImagePicker, IntentLauncherAndroid, Location } from 'expo';
import { ENV } from '../env';

const GOOGLE_API = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'

class MobileService {
    async launchAndroidLocationIntent() {
        await IntentLauncherAndroid.startActivityAsync(
            IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
        );
    }
    openLibrary = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if (status === 'granted') {
            const image = await ImagePicker.launchImageLibraryAsync()
            if (!image.cancelled) {
                return image
            }
        }
        return null;
    }

    getLocations = async () => {
        try {
            const permission = await Permissions.askAsync(Permissions.LOCATION)
            if (permission.status === 'granted') {
                const locationService = await Location.hasServicesEnabledAsync()
                if (!locationService) {
                    await this.launchAndroidLocationIntent();
                }
                // this takes very long sometime to fetch gps location. important to load quicly else give timeout
                const location = await Location.getCurrentPositionAsync()
                const url = `${GOOGLE_API}?location=${location.coords.latitude},${location.coords.longitude}&rankby=distance&key=${ENV.googleApiKey}`
                const response = await fetch(url)
                const data = await response.json()
                return data.results;
            } else {
                // TODO: report error to logger service
                console.log('dont have access to location');
                return null;
            }
        } catch (error) {
            console.log('error in post ', error);
            return null;
        }
    }
}

export default new MobileService();