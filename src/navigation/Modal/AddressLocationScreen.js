import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import CustomIcon from '../../component/CustomIcon';
import * as Location from 'expo-location';
import debounce from 'lodash/debounce';
import Http from '../../initialize/Http';
import { prettyDaDataAddress } from '../../store/helper/StringMethod';
import styled from 'styled-components';
import { useStore } from '../../store/Context';
import accessPolygon from '../../store/helper/AccessPolygon.json';
import { isPointInPolygon } from 'geolib';
import CloseIcon from '../../assets/svg/icon/CloseIcon';
import GeolocationIcon from '../../assets/svg/icon/GeolocationIcon';

const AddressLocationScreen = ({ fromLanding = false }) => {
  const store = useStore();
  const navigation = useNavigation();
  const mapRef = useRef();

  const { width, height } = useWindowDimensions();

  const ASPECT_RATIO = width / height;
  const LONGITUDE_DELTA = 0.005 * ASPECT_RATIO;

  const [outOfZone, setOutOfZone] = useState(true);
  const [address, setAddress] = useState({});
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [canSearchOnDrag, setCanSearchOnDrag] = useState(true);

  useEffect(() => {
    store.app.setAnalyticEvent('select_address');
  }, []);

  useEffect(() => {
    if (store.user.address?.address_location?.lat) {
      setAddress({
        title: store.user.address.name,
        lat: store.user.address.address_location.lat,
        lng: store.user.address.address_location.lng,
      });
      setCanSearchOnDrag(false);
      setTimeout(() => {
        fitToCoordinate({
          latitude: store.user.address.address_location.lat,
          longitude: store.user.address.address_location.lng,
        });

        setCanSearchOnDrag(true);
      }, 150);

      return;
    }

    setTimeout(() => {
      fitToMyLocation();
    }, 200);
  }, []);

  const fitToMyLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    let location = await Location.getLastKnownPositionAsync({});
    setTimeout(() => {
      if (location?.coords) fitToCoordinate(location.coords);
    }, 100);
  };

  const fitToCoordinate = (location) => {
    setTimeout(() => {
      mapRef.current.animateToRegion(
        {
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
          latitudeDelta: location.latitudeDelta ?? 0.0001,
          longitudeDelta: location.longitudeDelta ?? LONGITUDE_DELTA,
        },
        300
      );
    }, 100);
  };

  const searchAddress = useCallback(
    debounce(async (data) => {
      if (data.latitude && data.longitude) {
        let inPolygon = false;
        for (let i = 0; i < accessPolygon.length; i++) {
          if (
            isPointInPolygon(
              { latitude: data.latitude, longitude: data.longitude },
              accessPolygon[i]
            )
          ) {
            inPolygon = true;
            break;
          }
        }

        if (inPolygon) {
          setOutOfZone(false);
          const result = await Http.post(
            'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address',
            {
              count: 1,
              radius_meters: 0,
              ...{
                lat: data.latitude,
                lon: data.longitude,
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Token c78cc23dd291dca0ac4ff86a9b2ff43580234486',
              },
              external: true,
              noAuth: true,
            }
          );
          if (result.code === 200) {
            if (result.suggestions?.length) {
              setAddress({
                title: prettyDaDataAddress(result.suggestions[0].data),
                address_full: result.suggestions[0].unrestricted_value,
                lat: result.suggestions[0].data.geo_lat,
                lng: result.suggestions[0].data.geo_lon,
              });
            } else {
              setAddress(null);
            }

            setLoading(false);
          }
        } else {
          setLoading(false);
          setOutOfZone(true);
          setAddress(null);
        }
      }
    }, 500),
    []
  );

  const saveAddress = async () => {
    setSaveLoading(true);
    const result = await Http.post('/profile/address', {
      uuid: store.user.uuid,
      name: address.title,
      address: address.title,
      address_full: address.address_full,
      address_location: {
        lat: address.lat,
        lng: address.lng,
      },
    });

    setSaveLoading(false);
    if (result.code === 200) {
      store.user.set(result.data, false);
    }

    if (fromLanding) {
      navigation.replace('TabNavigation');
      return;
    }
    navigation.goBack();
  };

  const worldPolygon = useMemo(() => {
    return [
      {
        latitude: 85,
        longitude: 179,
      },
      {
        latitude: 85,
        longitude: 90,
      },
      {
        latitude: 85,
        longitude: 0,
      },
      {
        latitude: 85,
        longitude: -90,
      },
      {
        latitude: 85,
        longitude: -180,
      },
      {
        latitude: 0,
        longitude: -180,
      },
      {
        latitude: -85,
        longitude: -180,
      },
      {
        latitude: -85,
        longitude: -90,
      },
      {
        latitude: -85,
        longitude: 0,
      },
      {
        latitude: -85,
        longitude: 90,
      },
      {
        latitude: -85,
        longitude: 179,
      },
      {
        latitude: 0,
        longitude: 179,
      },
      {
        latitude: 85,
        longitude: 179,
      },
    ];
  }, []);

  return (
    <Wrapper>
      <Map
        ref={mapRef}
        initialRegion={{
          latitude: 55.74973,
          longitude: 37.624564,
          latitudeDelta: 0.0001,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        minZoomLevel={9}
        provider={MapView.PROVIDER_GOOGLE}
        showsCompass={false}
        onRegionChange={() => (canSearchOnDrag ? setLoading(true) : null)}
        onRegionChangeComplete={canSearchOnDrag ? searchAddress : null}
      >
        <Polygon
          key={'polygon'}
          strokeWidth={Platform.OS === 'android' ? 2 : 0.5}
          strokeColor={'#7B4EDE'}
          fillColor={'rgba(0, 0, 0, .3)'}
          coordinates={worldPolygon}
          opacity={0.5}
          holes={accessPolygon}
        />
        {/*accessPolygon.map((polygon, index) =>
						<Polygon key={"polygon" + index} strokeWidth={4} strokeColor={"#7B4EDE"}
								 fillColor={"rgba(123, 78, 222, 0.05)"}
								 coordinates={polygon}/>)*/}
      </Map>
      {!fromLanding ? (
        <CloseButton onPress={() => navigation.goBack()}>
          <CloseIcon />
        </CloseButton>
      ) : null}
      <MyLocationButton onPress={() => fitToMyLocation()}>
        <GeolocationIcon />
      </MyLocationButton>
      {!loading ? (
        <>
          <AddressBlock>
            <AddressTitle>
              {address?.title?.trim()?.length
                ? address?.title
                : outOfZone
                ? 'Вне зоны доставки'
                : 'Адрес не найден'}
            </AddressTitle>
            <ClarifyAddress
              onPress={() =>
                navigation.navigate('AddressInputScreen', {
                  address: address,
                  setAddress: setAddress,
                  fitToCoordinate: fitToCoordinate,
                })
              }
              pointerEvents="auto"
            >
              <Text style={{ color: '#000000', fontSize: 16 }}>Уточнить адрес</Text>
            </ClarifyAddress>
          </AddressBlock>

          {address?.title?.trim()?.length && !outOfZone ? (
            <SaveButton onPress={saveAddress}>
              {saveLoading ? <ActivityIndicator /> : <SaveButtonTitle>Сохранить</SaveButtonTitle>}
            </SaveButton>
          ) : null}
        </>
      ) : null}
      <MyLocation bottom={height / 2 - 40}>
        <CustomIcon width={53} height={99} icon="MyLocation" />
      </MyLocation>
    </Wrapper>
  );
};

export default observer(AddressLocationScreen);

const Wrapper = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const Map = styled(MapView)`
  flex: 1;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;
const CloseButton = styled(TouchableOpacity)`
  position: absolute;
  background-color: #ffffff;
  padding: 10px;
  top: 15px;
  left: 15px;
  border-radius: 100px;
  shadow-color: #000;
  shadow-offset: 2px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 5px;
`;

const MyLocationButton = styled(TouchableOpacity)`
  position: absolute;
  background-color: #ffffff;
  padding: 10px;
  bottom: 160px;
  right: 15px;
  border-radius: 100px;
  shadow-color: #000;
  shadow-offset: 2px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 5px;
  align-items: center;
  justify-content: center;
`;
const AddressBlock = styled(View)`
  position: absolute;
  align-items: center;
  top: 80px;
  padding-horizontal: 20px;
`;
const MyLocation = styled(View)`
  position: absolute;
  height: 99px;
  bottom: ${(props) => props.bottom}px;
`;
const AddressTitle = styled(Text)`
  text-align: center;
  font-size: 28px;
`;
const ClarifyAddress = styled(TouchableOpacity)`
  margin-top: 15px;
  background-color: #bebebd;
  padding-horizontal: 10px;
  padding-vertical: 5px;
  border-radius: 14px;
  shadow-color: #000;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
`;
const SaveButton = styled(TouchableOpacity)`
  position: absolute;
  bottom: 60px;
  left: 15px;
  right: 15px;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: #7b4ede;
  border-radius: 14px;
`;
const SaveButtonTitle = styled(Text)`
  font-weight: 500;
  color: #ffffff;
  font-size: 17px;
`;
