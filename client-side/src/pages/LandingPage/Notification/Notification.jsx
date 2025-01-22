import React from 'react';

export default function Notification() {
    return (
        <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-md text-center w-11/12 max-w-3xl mx-auto mt-4">
            Registrations for <strong>Weekend of Code</strong> are now open! 🎉 
            <a 
                href="https://weekendofcode.computercodingclub.in/" 
                className="text-blue-600 font-semibold hover:underline ml-2"
                target="_blank" 
                rel="noopener noreferrer"
            >
                Register Now
            </a>
        </div>
    );
}
