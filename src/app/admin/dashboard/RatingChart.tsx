
import React from 'react';
import { Star, User } from 'lucide-react';

const expertData = [
  {
    name: 'Aryan Sharma',
    performance: 9.3,
    technical: 8.1,
    tactical: 7.6,
    level: 'Advanced',
    color: 'bg-green-500',
    rating: 4.8,
   
    attendance: 5
  },
  {
    name: 'Priya Patel',
    performance: 8.8,
    technical: 8.2,
    tactical: 7.5,
    level: 'Intermediate',
    color: 'bg-blue-500',
    rating: 4.3,
   
    attendance: 4
  },
  {
    name: 'Rahul Verma',
    performance: 8.5,
    technical: 6.9,
    tactical: 7.2,
    level: 'Beginner',
    color: 'bg-yellow-500',
    rating: 4.1,
  
    attendance: 3
  }
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1 mt-1">
    {[1, 2, 3, 4, 5].map(star => (
      <Star
        key={star}
        className={`h-3 w-3 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))}
    <span className="ml-1 text-xs font-medium text-gray-600">{rating}/5</span>
  </div>
);

const RatingChart = () => {
  return (
   <div className="bg-white p-6 rounded-lg shadow-sm border">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-medium text-gray-900">Rating Performance</h3>
  </div>

  <div className="space-y-6">
    {expertData.map((doctor, index) => (
      <div key={index} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-black">{doctor.name}</span>
              </div>
            <StarRating rating={doctor.attendance} />
          </div>
        </div>

        <div className="ml-11 space-y-1">
          {/* Patient Care */}
          <div className="flex justify-between text-xs">
            <span className="text-black">Patient Care</span>
            <span className="font-medium text-black">{doctor.performance}/10</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className={`h-2 rounded ${
                doctor.performance >= 8
                  ? 'bg-green-500'
                  : doctor.performance >= 5
                  ? 'bg-yellow-400'
                  : 'bg-red-500'
              }`}
              style={{ width: `${doctor.performance * 10}%` }}
            />
          </div>

          {/* Medical Knowledge */}
          <div className="flex justify-between text-xs">
            <span className="text-black">Medical Knowledge</span>
            <span className="font-medium text-black">{doctor.technical}/10</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className={`h-2 rounded ${
                doctor.technical >= 8
                  ? 'bg-green-500'
                  : doctor.technical >= 5
                  ? 'bg-yellow-400'
                  : 'bg-red-500'
              }`}
              style={{ width: `${doctor.technical * 10}%` }}
            />
          </div>

          {/* Diagnosis Accuracy */}
          <div className="mt-2 mb-4">
            <div className="flex justify-between text-xs">
              <span className="text-black">Diagnosis Accuracy</span>
              <span className="font-medium text-black">{doctor.tactical}/10</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className={`h-2 rounded ${
                  doctor.tactical >= 8
                    ? 'bg-green-500'
                    : doctor.tactical >= 5
                    ? 'bg-yellow-400'
                    : 'bg-red-500'
                }`}
                style={{ width: `${doctor.tactical * 10}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    ))}

    <div className="text-center pt-2">
      <span className="text-xs text-gray-500">Showing 3 of 126 Doctors</span>
      <button className="ml-2 text-xs text-blue-600 hover:underline">View All Doctors</button>
    </div>
  </div>
</div>

  );
};

export default RatingChart;
