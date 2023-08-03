import styled from '@emotion/styled';
import { useCallback, useState } from 'react';
import dayjs from 'dayjs';

import WeatherIcon from './../components/WeatherIcon.jsx';
import { ReactComponent as AirFlowIcon } from './../images/airFlow.svg';
import { ReactComponent as LoadingIcon } from './../images/loading.svg';
import { ReactComponent as RainIcon } from './../images/rain.svg';
import { ReactComponent as RefreshIcon } from './../images/refresh.svg';
import { availableLocations } from './../utils/helpers';


const WeatherCardWrapper = styled.div`
  position: relative;
  top: ${({ cardPos }) => cardPos.y};
  left: ${({ cardPos }) => cardPos.x};
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 15px 15px 30px 15px;
`;

const LocationMenu = styled.select`
  display: block;
  width: 100%;
  max-width: 100%;
  background: transparent;
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.titleColor};
  cursor: pointer;
  padding: 7px 0px;
  border: none;
`;

const LocationOption = styled.option`
  background-color:  ${({ theme }) => theme.foregroundColor};
  font-size: 18px;
  color: ${({ theme }) => theme.titleColor};
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  padding-left: 5px;
  margin-bottom: 20px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const OtherInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 10px;
  }
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  margin-left: 50px;
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.textColor};

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => (isLoading ? '1.5s' : '0s')};
  }

  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;


const WeatherCard = ({
  weatherElement,
  currentCity,
  moment,
  fetchData,
  updateCityName
}) => {
  const {
    observationTime,
    temperature,
    windSpeed,
    description,
    weatherCode,
    rainPossibility,
    comfortability,
    isLoading,
  } = weatherElement;

  const menuChanged = (e) => {
    const locationName = e.target.value;
    localStorage.setItem("cityName", locationName);
    updateCityName(locationName);
  };

  const [cardPos, setCardPos] = useState(() => {
    return {
      x: "0px",
      y: "0px",
    }
  });

  const [start, setStart] = useState(() => {
    return {
      x: undefined,
      y: undefined,
    }
  });

  const [isDragging, SetIsDragging] = useState(() => false);

  const dragStart = (e) => {
    setStart({
      x: e.clientX,
      y: e.clientY,
    });
    SetIsDragging(true);
  };

  const dragging = useCallback((e) => {
    if (isDragging) {
      const xBias = Number(cardPos.x.slice(0, -2))
                    + e.clientX
                    - start.x;
      const yBias = Number(cardPos.y.slice(0, -2))
                    + e.clientY
                    - start.y;
      setCardPos({
        x: `${xBias}px`,
        y: `${yBias}px`,
      });
    }
  }, [isDragging])

  const dragEnd = () => {
    SetIsDragging(false);
  };

  return (
    <WeatherCardWrapper 
      cardPos={cardPos} 
      onMouseDown={dragStart}
      onMouseMove={dragging}
      onMouseUp={dragEnd}
      onMouseLeave={dragEnd}
    >
      <LocationMenu
        id="location"
        name="location"
        onChange={menuChanged}
        value={currentCity}
      >
        {availableLocations.map(({ cityName }) => (
          <LocationOption value={cityName} key={cityName}>
            {cityName}
          </LocationOption>
        ))}
      </LocationMenu>
      <Description>
        {description} {comfortability}
      </Description>
      <CurrentWeather>
        <Temperature>
          {Math.round(temperature)} <Celsius>°C</Celsius>
        </Temperature>
        <WeatherIcon weatherCode={weatherCode} moment={moment} />
      </CurrentWeather>
      <OtherInfo>
        <AirFlow>
          <AirFlowIcon /> {windSpeed} m/h
        </AirFlow>
        <Rain>
          <RainIcon /> {rainPossibility}%
        </Rain>
      </OtherInfo>
      <Refresh onClick={fetchData} isLoading={isLoading}>
        最後觀測時間：
        {new Intl.DateTimeFormat('zh-TW', {
          hour: 'numeric',
          minute: 'numeric',
        }).format(dayjs(observationTime))}{' '}
        {isLoading ? <LoadingIcon /> : <RefreshIcon />}
      </Refresh>
    </WeatherCardWrapper>
  );
};

export default WeatherCard;
