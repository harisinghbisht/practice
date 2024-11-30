import React, { useState } from 'react';
import { Plane } from 'lucide-react';

function FlightResults({ flights, loading, error }) {
    const [sortBy, setSortBy] = useState(null); // State to track sorting method

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const sortedFlights = [...flights]; // Create a copy of the flights array for sorting

    // Debugging: Check the structure of the flights data
    console.log(flights);

    // Correct sorting logic for price
    if (sortBy === 'price-asc') {
        sortedFlights.sort((a, b) => {
            // Check if raw price exists
            const priceA = a.price?.raw || 0;
            const priceB = b.price?.raw || 0;
            return priceA - priceB;
        });
    } else if (sortBy === 'price-desc') {
        sortedFlights.sort((a, b) => {
            const priceA = a.price?.raw || 0;
            const priceB = b.price?.raw || 0;
            return priceB - priceA;
        });
    } else if (sortBy === 'duration-asc') {
        sortedFlights.sort((a, b) => a.legs[0].durationInMinutes - b.legs[0].durationInMinutes); // Sort by duration (ascending)
    } else if (sortBy === 'duration-desc') {
        sortedFlights.sort((a, b) => b.legs[0].durationInMinutes - a.legs[0].durationInMinutes); // Sort by duration (descending)
    }

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-95 z-50">
                <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Plane className="h-5 w-5 text-blue-400" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 rounded-xl shadow-lg p-6 max-w-4xl mt-3 mx-auto mt-10">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293-1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!flights.length) {
        return null;
    }

    return (
        <div className="space-y-4 mt-10">
            {/* Sorting Controls */}
            <div className="max-w-4xl mx-auto p-4">
                <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
                <select
                    id="sort"
                    className="border border-gray-300 rounded-md p-2 transition-colors duration-200 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    onChange={handleSortChange}
                    value={sortBy || ''}
                >
                    <option value="" disabled>Select</option>
                    <option value="price-asc">Price (Lowest to Highest)</option>
                    <option value="price-desc">Price (Highest to Lowest)</option>
                    <option value="duration-asc">Duration (Shortest to Longest)</option>
                    <option value="duration-desc">Duration (Longest to Shortest)</option>
                </select>
            </div>

            {/* Flight Results */}
            {sortedFlights.map((flight, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mt-3 mx-auto transition-transform duration-300 ease-in-out hover:scale-105">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        {/* Airline and Flight Info */}
                        <div className="flex items-center">
                            <img
                                src={flight.legs[0].carriers.marketing[0].logoUrl}
                                alt={flight.legs[0].carriers.marketing[0].name}
                                className="h-12 w-12 mb-2 rounded-full"
                            />
                            <div className="ml-2">
                                <p className="text-lg font-semibold">{flight.legs[0].carriers.marketing[0].name}</p>
                                <p className="text-sm text-gray-500">Flight Number: {flight.legs[0].segments[0].flightNumber}</p>
                            </div>
                        </div>

                        {/* Departure and Arrival Info */}
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-4">
                                {/* Departure */}
                                <div>
                                    <p className="text-lg font-semibold" style={{ textWrap: 'nowrap' }}>{new Date(flight.legs[0].departure).toLocaleTimeString()}</p>
                                    <p className="text-sm text-gray-500" style={{ textWrap: 'nowrap' }}>{flight.legs[0].origin.name} ({flight.legs[0].origin.displayCode})</p>
                                </div>

                                {/* Arrow */}
                                <div className="flex-1 border-t border-gray-300 relative">
                                    <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 00-.725-.962l-5-1.429a1 1 0 01.725-1.962l5 1.429a1 1 0 00.725-.038l5-1.429a1 1 0 011.169 1.409l-7 14z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Arrival */}
                                <div>
                                    <p className="text-lg font-semibold" style={{ textWrap: 'nowrap' }}>{new Date(flight.legs[0].arrival).toLocaleTimeString()}</p>
                                    <p className="text-sm text-gray-500" style={{ textWrap: 'nowrap' }}>{flight.legs[0].destination.name} ({flight.legs[0].destination.displayCode})</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Duration: {Math.floor(flight.legs[0].durationInMinutes / 60)}h {flight.legs[0].durationInMinutes % 60}m</p>
                        </div>

                        {/* Price and Action */}
                        <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600 transition-transform duration-200 hover:scale-110">{flight.price.formatted}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FlightResults;
