import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Users, Plane, Repeat, ArrowRightCircle } from 'lucide-react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Import styles
import 'react-date-range/dist/theme/default.css'; // Import theme

export default function SearchForm({ onSearch }) {
    const [searchData, setSearchData] = useState({
        origin: '',
        destination: '',
        passengers: 1,
        cabinClass: 'economy',
    });

    const [originSuggestions, setOriginSuggestions] = useState([]); // Mocked suggestions
    const [destinationSuggestions, setDestinationSuggestions] = useState([]); // Mocked suggestions
    const [calendarVisible, setCalendarVisible] = useState(false);
    const calendarRef = useRef(null); // Create a ref for the calendar

    // Set default date range with today’s date
    const [dateRange, setDateRange] = useState([{
        startDate: new Date(),
        endDate: null,
        key: 'selection'
    }]);

    const cabinClasses = ['Economy', 'Premium economy', 'Business', 'First'];

    // Mock data for suggestions
    const airports = [
        { id: 1, name: 'Cairo', iataCode: 'CAI' },
        { id: 2, name: 'New York', iataCode: 'JFK' },
        { id: 3, name: 'London', iataCode: 'LHR' }
    ];

    // Handle the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedSearchData = {
            ...searchData,
            passengers: parseInt(searchData.passengers, 10),
            departDate: dateRange[0].startDate.toISOString().split('T')[0],
            returnDate: dateRange[0].endDate ? dateRange[0].endDate.toISOString().split('T')[0] : null,
        };

        if (!formattedSearchData.origin || !formattedSearchData.destination || !formattedSearchData.departDate) {
            alert('Please fill out all required fields.');
            return;
        }

        onSearch(formattedSearchData);
    };

    // Handle input changes and mock the fetching of suggestions
    const handleOriginChange = (e) => {
        const query = e.target.value;
        setSearchData({ ...searchData, origin: query });
        if (query.length > 2) {
            const filtered = airports.filter(airport =>
                airport.name.toLowerCase().includes(query.toLowerCase())
            );
            setOriginSuggestions(filtered);
        } else {
            setOriginSuggestions([]);
        }
    };

    const handleDestinationChange = (e) => {
        const query = e.target.value;
        setSearchData({ ...searchData, destination: query });
        if (query.length > 2) {
            const filtered = airports.filter(airport =>
                airport.name.toLowerCase().includes(query.toLowerCase())
            );
            setDestinationSuggestions(filtered);
        } else {
            setDestinationSuggestions([]);
        }
    };

    // Handle selection of suggestions
    const handleOriginSelect = (suggestion) => {
        setSearchData({ ...searchData, origin: suggestion.name });
        setOriginSuggestions([]);
    };

    const handleDestinationSelect = (suggestion) => {
        setSearchData({ ...searchData, destination: suggestion.name });
        setDestinationSuggestions([]);
    };

    // Format selected date range for input field display
    const formatDateRange = () => {
        const start = dateRange[0].startDate ? dateRange[0].startDate.toLocaleDateString() : 'Select date';
        const end = dateRange[0].endDate ? dateRange[0].endDate.toLocaleDateString() : '';
        return end ? `${start} - ${end}` : start;
    };

    // Effect to handle clicks outside of the calendar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setCalendarVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className=" rounded-xl shadow-lg p-10 max-w-4xl mx-auto transition-transform duration-500">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Round Trip Button, Passengers Input, and Cabin Class */}
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                    <Repeat className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Round trip</span>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                    {/* Passengers Input */}
                    <div className="relative flex items-center w-full md:w-auto">
                        <Users className="absolute left-3 h-5 w-5 text-gray-400" />
                        <input
                            type="number"
                            min="1"
                            max="9"
                            className="pl-10 pr-6 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full shadow-lg transition duration-300 ease-in-out"
                            value={searchData.passengers}
                            onChange={(e) => setSearchData({ ...searchData, passengers: e.target.value })}
                            required
                        />
                    </div>

                    {/* Cabin Class */}
                    <div className="relative flex items-center w-full md:w-auto">
                        <select
                            className="pr-6 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full shadow-lg transition duration-300 ease-in-out"
                            value={searchData.cabinClass}
                            onChange={(e) => setSearchData({ ...searchData, cabinClass: e.target.value })}
                            required
                        >
                            {cabinClasses.map((cabinClass) => (
                                <option key={cabinClass.toLowerCase()} value={cabinClass.toLowerCase()}>
                                    {cabinClass}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Origin and Destination Inputs with Suggestions */}
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                    {/* Origin */}
                    <div className="relative flex items-center w-full md:w-1/3">
                        <Plane className="absolute left-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            className="pl-10 pr-6 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full shadow-lg transition duration-300 ease-in-out"
                            placeholder="Where from (e.g., USA)"
                            value={searchData.origin}
                            onChange={handleOriginChange}
                            required
                        />

                        {/* Dropdown for origin suggestions */}
                        {originSuggestions.length > 0 && (
                            <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg z-10 transition-opacity duration-500 ease-in-out">
                                {originSuggestions.map((suggestion) => (
                                    <li
                                        key={suggestion.id}
                                        onClick={() => handleOriginSelect(suggestion)}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {suggestion.name} ({suggestion.iataCode})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <ArrowRightCircle className="hidden md:block h-5 w-5 text-gray-500" />

                    {/* Destination */}
                    <div className="relative flex items-center w-full md:w-1/3">
                        <Plane className="absolute left-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            className="pl-10 pr-6 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full shadow-lg transition duration-300 ease-in-out"
                            placeholder="Where to (e.g., Canada)"
                            value={searchData.destination}
                            onChange={handleDestinationChange}
                            required
                        />
                        {/* Dropdown for destination suggestions */}
                        {destinationSuggestions.length > 0 && (
                            <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg z-10 transition-opacity duration-500 ease-in-out">
                                {destinationSuggestions.map((suggestion) => (
                                    <li
                                        key={suggestion.id}
                                        onClick={() => handleDestinationSelect(suggestion)}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {suggestion.name} ({suggestion.iataCode})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Date Inputs */}
                    <div className="relative flex items-center w-full md:w-1/3">
                        <Calendar className="absolute left-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            readOnly
                            className="pl-10 pr-6 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full cursor-pointer shadow-lg transition duration-300 ease-in-out"
                            value={formatDateRange()}  // Display selected date range
                            onClick={() => setCalendarVisible(!calendarVisible)}
                        />

                        {calendarVisible && (
                            <div ref={calendarRef} className="absolute top-0 z-10 mt-10 w-full md:w-1/3 transition-transform duration-500 ease-in-out transform animate-fadeIn">
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={ranges => setDateRange([ranges.selection])}
                                    moveRangeOnFirstSelection={false}
                                    ranges={dateRange}
                                    className="bg-white rounded-lg shadow-lg"
                                />
                                {/* Done button to confirm selection and close the calendar */}
                                <div className="text-right mt-2">
                                    <button
                                        onClick={() => setCalendarVisible(false)}  // Close the calendar on click
                                        className="calendar-btn px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 ease-in-out"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Button */}
                <div className="flex justify-center search-btn">
                    <button
                        type="submit"
                        className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 ease-in-out"
                    >
                        Search
                    </button>
                </div>
            </form>
        </div>
    );
}
