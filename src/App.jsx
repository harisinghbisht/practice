import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import FlightResults from './components/FlightResults';
import axios from 'axios';


const App = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiHeaders = useMemo(() => ({
    'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
    'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
  }), []);

  const searchFlights = async (searchData) => {
    setLoading(true);
    setError(null);

    try {
      const [originResponse, destinationResponse] = await Promise.all([
        axios.get('https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport', {
          params: { query: searchData.origin, locale: 'en-US' },
          headers: apiHeaders,
        }),
        axios.get('https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport', {
          params: { query: searchData.destination, locale: 'en-US' },
          headers: apiHeaders,
        })
      ]);

      const originData = originResponse.data.data[0];
      const destinationData = destinationResponse.data.data[0];

      const flightsResponse = await axios.get(
        'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights',
        {
          params: {
            originSkyId: originData.skyId,
            destinationSkyId: destinationData.skyId,
            originEntityId: originData.entityId,
            destinationEntityId: destinationData.entityId,
            date: searchData.departDate,
            returnDate: searchData.returnDate,
            adults: searchData.passengers,
            cabinClass: searchData.cabinClass,
            currency: 'USD',
            market: 'en-US',
          },
          headers: apiHeaders,
        }
      );

      const itineraries = flightsResponse.data?.data?.itineraries || [];

      if (itineraries.length > 0) {
        setFlights(itineraries);
      } else {
        setFlights([]);
        setError('No flights found for the given criteria.');
      }
    } catch (error) {
      setError('Failed to fetch flights. Please try again.');
      console.log("error",error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div
            className="w-full lg:h-96 bg-cover bg-center rounded-xl shadow-xl"
          >
            <img className='inset-1' src="https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_4.svg" alt="" />
          </div>
        </div>
        <div className="text-3xl font-semibold font-serif text-center ">Flights</div>
        <div className="container mx-auto px-4 py-4 md:py-8 text-center">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SearchForm onSearch={searchFlights} />
                  <FlightResults flights={flights} loading={loading} error={error} />
                </>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
