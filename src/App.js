import React, { useState } from 'react';
function App() {
    const[city, setCity] = useState('');
    const[weatherData, setWeatherData] = useState(null);
    const[error, setError] = useState(null);
	const [cityButtons, setCityButtons] = useState(['Austin', 'Dallas', 'Houston']);
	
	
    const getCoordinates = async(city) => {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        try {
			const response = await fetch(url);
			const geoData = await response.json();
			if (geoData.results.length === 0) {
				throw new Error('City not found');
			}
			const {latitude, longitude} = geoData.results[0];
			return {latitude, longitude};
		} catch (error) {
			setError('Error fetching coordinates for city');
			setWeatherData(null);
			throw error;
		}
    };

    const getWeatherData = async(latitude, longitude) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto&timeformat=unixtime&temperature_unit=fahrenheit`;
        try {
            const response = await fetch(url);
            const weatherData = await response.json();
            setWeatherData(weatherData);
            setError(null);
        } catch (error) {
            setError('Error fetching weather data');
            setWeatherData(null);
        }
    };

    const clickCityHandler = async(city) => {
        setWeatherData(null);
        setError(null);

        try {
            const {latitude, longitude} = await getCoordinates(city);
            await getWeatherData(latitude, longitude);
        } catch (error) {}
    };

    const handleAddCity = async() => {
		if (!city) {
			setError("Please enter a city");
			return;
		}
		if (cityButtons.includes(city)) {
			setError("City already added");
			return;
		}
		try {
			await getCoordinates(city);
			setCityButtons((prevButtons) => [... prevButtons, city]);
			setCity('');
			setError(null);
		} catch (err) {
			setError("City is not found");
		}
	};
	
	const handleInputChange = (event) => { setCity(event.target.value); };
	
	const formatTime = (unixTime) => {
		const date = new Date(unixTime * 1000);
		const hours = date.getHours();
		const ampm = hours >= 12? "PM" : "AM";
		const hoursFormatted = hours % 12 === 0 ? 12 : hours % 12;
		return `${hoursFormatted}:00 ${ampm}`;
	};

    return (
        <div className = "App"><h1> Weather App</ h1>
		<div>
			{cityButtons.map((cityName, index) => (
				<button key={index} onClick={() => clickCityHandler(cityName)}>{cityName}</button>
			))}
		</div>
        <input type = "text" placeholder = "Enter city" value = {city} onChange = {handleInputChange}/>
        <button onClick = {handleAddCity}>+</ button>
        {error && <p>{error} </p> }
        {weatherData ? (
			<table>
				<thead>
					<tr>
						<th>Time</th>
						<th>Temperature</th>
					</tr>
				</thead>
				<tbody>
					{weatherData.hourly.time.slice(0, 12).map((unixTime, index) => {
						const timeFormatted = formatTime(unixTime);
						const temperatureFahrenheit = weatherData.hourly.temperature_2m[index];
						return (
							<tr key={unixTime}>
								<td>{timeFormatted}</td>
								<td>{temperatureFahrenheit.toFixed(1)}°F</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		) : (<p> Enter a city.</ p>)}
		</div>);
};

export default App;