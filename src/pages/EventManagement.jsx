import React from 'react';

const EventManagement = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Event Management</h2>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Create Event</button>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weather Mood</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emotional Target</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: 'Annual Tech Conference', date: 'Apr 15-17, 2025', location: 'San Francisco', status: 'Planning', weather: 'Sunny', emotion: 'Excitement' },
                  { name: 'Product Launch', date: 'Mar 5, 2025', location: 'Virtual Event', status: 'Confirmed', weather: 'N/A', emotion: 'Anticipation' },
                  { name: 'Leadership Summit', date: 'Jun 12, 2025', location: 'Chicago', status: 'Planning', weather: 'Partly Cloudy', emotion: 'Focus' },
                  { name: 'Team Building Retreat', date: 'Aug 22-24, 2025', location: 'Colorado', status: 'Draft', weather: 'Sunny', emotion: 'Connection' },
                  { name: 'Quarterly Business Review', date: 'Jul 7, 2025', location: 'New York', status: 'Planning', weather: 'Indoor', emotion: 'Confidence' }
                ].map((event, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' : 
                        event.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.weather}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.emotion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;