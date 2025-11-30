import React, { useState } from 'react';

// This is a React Island component for the Corporate Site (Marketplace)
// It manages local state for search and filtering without involving the main Astro page.
// It is styled using the Corporate (League) color palette.

const SearchFilterBar = () => {
    // State for the main search input
    const [searchTerm, setSearchTerm] = useState('');
    // State for the category filter (e.g., Math, Science, Arts)
    const [category, setCategory] = useState('');
    // State for the age filter
    const [ageGroup, setAgeGroup] = useState('');

    const categories = ['Math', 'Coding', 'Science', 'Arts', 'Life Skills'];
    const ageGroups = ['3-5', '6-8', '9-12', '13-18'];

    const handleSearch = (e) => {
        e.preventDefault();
        // In a real application, this would dispatch a search query to an API
        console.log("Searching with:", { searchTerm, category, ageGroup });
        alert(`Searching for '${searchTerm}' in ${category || 'All Categories'} for ages ${ageGroup || 'All Ages'}.`);
        // Note: Using alert() here for simplicity in the demo.
    };

    const inputClasses = "bg-corporate-bg-dark border border-corporate-primary/50 text-white placeholder-gray-400 p-3 rounded-lg focus:ring-corporate-secondary focus:border-corporate-secondary shadow-lg";
    const selectClasses = `${inputClasses} appearance-none cursor-pointer`;
    const buttonClasses = "w-full md:w-auto bg-corporate-secondary text-text-dark font-bold text-body-base p-3 rounded-lg shadow-xl hover:bg-corporate-secondary/80 transition duration-200";

    return (
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto p-6 rounded-xl bg-corporate-bg-dark/70 shadow-2xl backdrop-blur-sm border border-corporate-primary">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* 1. Main Search Input */}
                <div className="md:col-span-2">
                    <label htmlFor="search" className="sr-only">Search Courses</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search for subjects, instructors, or badges..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${inputClasses} w-full`}
                    />
                </div>

                {/* 2. Category Filter */}
                <div>
                    <label htmlFor="category" className="sr-only">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`${selectClasses} w-full`}
                    >
                        <option value="">All Subjects</option>
                        {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* 3. Age Filter */}
                <div>
                    <label htmlFor="age" className="sr-only">Age Group</label>
                    <select
                        id="age"
                        value={ageGroup}
                        onChange={(e) => setAgeGroup(e.target.value)}
                        className={`${selectClasses} w-full`}
                    >
                        <option value="">All Ages</option>
                        {ageGroups.map(a => (
                            <option key={a} value={a}>Ages {a}</option>
                        ))}
                    </select>
                </div>

                {/* 4. Search Button */}
                <button
                    type="submit"
                    className={buttonClasses}
                >
                    Find Classes
                </button>
            </div>
            
            <p className="mt-4 text-sm text-gray-400 text-left font-corp-body">
                Tip: Try searching for "Python" or "Art fundamentals".
            </p>
        </form>
    );
};

export default SearchFilterBar;