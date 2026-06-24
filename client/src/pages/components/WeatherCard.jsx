import { useEffect, useState } from "react";

const WeatherCard = ({ city }) => {
  const [weather, setWeather] = useState(null);

  const cityMap = {
    Swat: "Mingora",
    "Swat Valley": "Mingora",
    Hunza: "Karimabad",
    Skardu: "Skardu",
    Gilgit: "Gilgit",
    Murree: "Murree",
    Naran: "Naran",
    Kaghan: "Balakot",
    Chitral: "Chitral",
    Neelum: "Muzaffarabad",
  };

  const rawCity = city?.split(",")[0]?.trim();
  const cityName = cityMap[rawCity] || rawCity;

  useEffect(() => {
    const getWeather = async () => {
      try {
        const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            cityName
          )},PK&appid=${API_KEY}&units=metric`
        );

        const data = await res.json();

        if (data.cod === 200 || data.cod === "200") {
          setWeather(data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (cityName) getWeather();
  }, [cityName]);

  if (!weather) {
    return (
      <div className="max-w-sm w-full rounded-xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Loading weather...</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm w-full rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          📍 {weather.name}
        </h2>

        {/* Your brand color */}
        <span
          className="text-xs px-2 py-1 rounded-full text-white"
          style={{ backgroundColor: "rgb(235 102 43)" }}
        >
          Live
        </span>
      </div>

      {/* Temperature */}
      <div className="flex items-end gap-2 mb-3">
        <h1
          className="text-4xl font-bold"
          style={{ color: "rgb(235 102 43)" }}
        >
          {Math.round(weather.main.temp)}°
        </h1>
        <span className="text-gray-500 mb-1">C</span>
      </div>

      {/* Condition */}
      <p className="text-sm text-gray-600 capitalize mb-4">
        {weather.weather[0].description}
      </p>

      {/* Divider */}
      <div className="border-t my-4"></div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 text-sm">

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500 text-xs">Wind</p>
          <p className="font-medium text-gray-800">
            💨 {weather.wind.speed} m/s
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500 text-xs">Humidity</p>
          <p className="font-medium text-gray-800">
            💧 {weather.main.humidity}%
          </p>
        </div>

      </div>
    </div>
  );
};

export default WeatherCard;