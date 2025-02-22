import React, {useState, useMemo, useRef, useCallback} from 'react';
import type {CSSProperties} from 'react';
import styled from '@emotion/styled';

import WeatherIcon from '../components/WeatherIcon';
import Tooltip from '../components/Tooltip';
import useWeatherAPI from '../hooks/useWeatherAPI';
import {getLocation, cities, getWindDirText, getBeaufortScale} from '../utils/helpers';
import type {Moments} from '../components/WeatherIcon';
import type {City} from '../utils/helpers';

// Components
const CardWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 8px 16px 16px 8px;
  padding: 12px;
  padding-left: 24px;
  width: 450px;
  background: ${({theme}) => theme.cardGrad};
  box-shadow: ${({theme}) => theme.boxShadow};
  > * + * {
    margin-top: 4px;
  }
  @media screen and (max-width: 500px) {
    width: 100%;
  }
`;

const DragableRegion = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 22px;
  height: 100%;
  padding: 8px 4px;
  opacity: 0.5;
  background-image: radial-gradient(${({theme}) => theme.textColor1} 1px, transparent 0);
  background-size: 7px 7px;
  background-position: 4px 0px;
  background-clip: content-box;
  transition: all 1s ease;
  cursor: move;
  touch-action: none;
  user-select: none;
`;


const CityMenu = styled.select`
  width: 85px;
  background: transparent;
  font-size: 18px;
  font-weight: 600;
  color: ${({theme}) => theme.textColor1};
  cursor: pointer;
  border: none;
  &:hover {
    background: ${({theme}) => theme.hoverBgColor};
  }
`;

const LocationOption = styled.option`
  background-color:  ${({theme}) => theme.bgColor};
  color: ${({theme}) => theme.textColor1};
  font-size: 16px;
`;

const TownMenu = styled.select`
  width: 85px;
  background: transparent;
  font-size: 18px;
  font-weight: 600;
  color: ${({theme}) => theme.textColor1};
  cursor: pointer;
  margin-left: 10px;
  border: none;
  &:hover {
    background: ${({theme}) => theme.hoverBgColor};
  }
`;

const CloseButton = styled.button`
  font-size: 14pt;
  float: right;
  color: ${({theme}) => theme.textColor1};
`;

const BasicInfo = styled.div`
  flex: 1 1 0;
  position: relative;
  width: 100%;
  padding: 0 8px;
`;

const Temperature = styled.span`
  color: ${({theme}) => theme.textColor1};
  font-size: 28pt;
  font-weight: bolder;
  letter-spacing: -2px;
`;

const Description = styled.div`
  font-size: 14pt;
  color: ${({theme}) => theme.textColor2};
  font-weight: bold;
  @media screen and (max-width: 500px) {
    display: block;
    margin-left: 0;
  }
`;

const WeatherIconWrapper = styled.div`
  position: absolute;
  top: 60%;
  right: 20px;
  transform: translate(0,-50%);
  color: ${({theme}) => theme.textColor1};
  font-size: 40pt;
`;

const DetailInfo = styled.div`
  width: 100%;
  white-space: nowrap;
  color: ${({theme}) => theme.textColor2};
  padding: 0 8px;
  > span + span {
    padding-left: 16px;
  }
`;

const DetailInfoItem = styled.span`
  font-size: 12pt;
  font-weight: 400;
`;

const LastUpdated = styled.div`
  color: ${({theme}) => theme.textColor2};
  font-size: 12px;
  text-align: end;
  @media screen and (max-width: 500px) {
    font-size: 14px;
  }
`;

const Refresh = styled.button<{isLoading: boolean}>`
  margin-left: 4px;
  color: ${({theme}) => theme.textColor1};
  animation: ${({isLoading}) => (
    isLoading ?
      'rotate infinite 0.8s linear;' :
      'rotate 1 0.8s linear;'
  )};

  &:focus, &:hover {
    outline: none;
  }
`;

export type WeatherCardProps = {
  cardIdx: number,
  moment: Moments,
  delCard: (cardIdx: number) => void,
}
const WeatherCard = ({
  cardIdx,
  moment,
  delCard,
}: WeatherCardProps) => {
  // Displayed city name and observation location name.
  const [currentCity, setCurrentCity] = useState<City>(() =>
    localStorage.getItem(`city${cardIdx}`) as City || '臺北市',
  );
  const [currentTown, setCurrentTown] = useState(() =>
    localStorage.getItem(`town${cardIdx}`) || '---',
  );
  const location = useMemo(() => getLocation(currentCity),
    [currentCity]);

  // fetch weather info from API.
  const [weatherElement, fetchData, isRefreshCD] = useWeatherAPI(
    location.repStationID,
    currentCity,
    currentTown,
  );

  const {
    observationTime,
    tempCurrent,
    windSpeed,
    windDir,
    description,
    weatherCode,
    rainPossibility,
    comfortability,
    isLoading,
  } = weatherElement;

  const obsTime = useMemo(() => {
    return `最後觀測時間：${
      new Intl.DateTimeFormat('zh-TW', {
        hour: 'numeric',
        minute: 'numeric',
      }).format(observationTime)
    } `;
  }, [observationTime]);

  const windSpeedTip = useMemo(() => {
    const {descr_} = getBeaufortScale(windSpeed);
    return descr_ + ' - ' + windSpeed + 'm/h';
  }, [windSpeed]);

  const {cls_: windDirCls_, windDirTip_} = useMemo(() => {
    const {cls_, text_} = getWindDirText(windDir);
    return {
      cls_,
      windDirTip_: '風向 - ' + text_
    };
  }, [windDir]);


  const cityChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationName = e.target.value as City;
    localStorage.setItem(`town${cardIdx}`, '---');
    setCurrentTown('---');
    localStorage.setItem(`city${cardIdx}`, locationName);
    setCurrentCity(locationName);
  };

  const townChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const townName = e.target.value;
    localStorage.setItem(`town${cardIdx}`, townName);
    setCurrentTown(townName);
  };
  const townItems = useMemo(() => {
    return (
      <>
        <LocationOption
          value={'---'}
          key={'---'}>
          ---
        </LocationOption>
        {
          location.towns.map((town) => (
            <LocationOption
              value={town}
              key={town}>
              {town}
            </LocationOption>
          ))
        }
      </>
    );
  }, [currentCity]);


  // Drag event
  const [cardStyle, setCardStyle] = useState<CSSProperties>(() => ({
    top: 0
  }));

  const ref = useRef<HTMLDivElement>(null);
  const draggingStart = useMemo(() => {
    let isDragging = false;
    const startPoint = {
      y: 0,
    };
    function start(e: React.MouseEvent<HTMLDivElement>) {
      isDragging = true;
      const domStyle = ref.current!.style;
      // final pos = previous pos + variation
      // variation = mousemoveEvent.clientPos - mousedownEvent.clientPos
      // start = previous pos - mousedownEvent.clientPos.
      startPoint.y = parseFloat(domStyle.top) - e.clientY;
      window.addEventListener('pointermove', move, true);
      window.addEventListener('pointerup', end, true);
    }
    function move(e: MouseEvent) {
      if (isDragging) {
        setCardStyle({
          top: `${startPoint.y + e.clientY}px`
        });
      }
      // e.stopPropagation();
    }
    function end(e: MouseEvent) {
      isDragging = false;
      window.removeEventListener('pointermove', move, true);
      window.removeEventListener('pointerup', end, true);
      e.stopPropagation();
    }
    return start;
  }, []);

  // Delete event
  const deleteEvent = useCallback(() =>{
    delCard(cardIdx);
  }, [cardIdx]);

  // useEffect(() => {
  //   // 檢驗資料抓取
  //   let idxCity = 0;
  //   let idxTown = 0;
  //   let currentCity = cities[idxCity];
  //   setCurrentCity(currentCity);
  //   let towns = ["---", ...getTowns(currentCity)];
  //   let currentTown = towns[idxTown];
  //   const intervalId = setInterval(() => {
  //     if (!currentCity) return;
  //     console.log(currentCity, currentTown);
  //     if (currentTown) {
  //       setCurrentTown(currentTown);
  //       idxTown += 1;
  //       currentTown = towns[idxTown];
  //     } else { // 切換城市
  //       idxCity += 1;
  //       currentCity = cities[idxCity];
  //       if (!currentCity) return;
  //       else {
  //         towns = ["---", ...getTowns(currentCity)];
  //         idxTown = 0;
  //         currentTown = towns[idxTown];
  //         setCurrentCity(currentCity);
  //         setCurrentTown(currentTown);
  //       }
  //     }
  //   }, 100);
  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <CardWrapper
      ref={ref}
      style={cardStyle}
    >
      <DragableRegion
        onPointerDownCapture={draggingStart}
      />
      <div>
        <CityMenu
          name="city"
          aria-label="縣市"
          value={currentCity}
          onChange={cityChanged}
        >
          {
            cities.map((city) => (
              <LocationOption
                key={city}
                value={city}
              >
                {city}
              </LocationOption>
            ))
          }
        </CityMenu>
        <TownMenu
          name="town"
          aria-label="鄉鎮市區"
          value={currentTown}
          onChange={townChanged}
        >
          {townItems}
        </TownMenu>
        <CloseButton
          type="button"
          onClick={deleteEvent}
        >
          <i className='bi bi-x-lg' />
        </CloseButton>
      </div>
      <BasicInfo>
        <Temperature>
          {Math.round(tempCurrent)}&thinsp;°C
        </Temperature>
        <Description>
          {description} {comfortability}
        </Description>
        <WeatherIconWrapper>
          {WeatherIcon({weatherCode, moment})}
        </WeatherIconWrapper>
      </BasicInfo>
      <DetailInfo>
        <DetailInfoItem id={'WindSpeed'}>
          <Tooltip
            id={'WindSpeed'}
            content={windSpeedTip}
          />
          <i className='wi wi-strong-wind' /> {windSpeed} m/s
        </DetailInfoItem>
        <DetailInfoItem id={'WindDir'}>
          <Tooltip
            id={'WindDir'}
            content={windDirTip_}
          />
          <i className={windDirCls_} /> {windDir}°
        </DetailInfoItem>
        <DetailInfoItem id={'Rain'}>
          <Tooltip
            id={'Rain'}
            content={'12小時內降雨機率'}
          />
          <i className='wi wi-umbrella' /> {rainPossibility}%
        </DetailInfoItem>
      </DetailInfo>
      {/* <div className="spacer" /> */}
      <LastUpdated>
        {obsTime}
        <Refresh
          type="button"
          isLoading={isLoading}
          disabled={isRefreshCD || isLoading}
          onClick={isLoading ? undefined : fetchData}
        >
          <i className='bi bi-arrow-clockwise' />
        </Refresh>
      </LastUpdated>
    </CardWrapper>
  );
};

export default WeatherCard;
