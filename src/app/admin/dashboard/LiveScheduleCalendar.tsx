import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
const scheduleData = [{
  id: 1,
  title: 'General Consultation',
  startTime: '09:00',
  endTime: '11:00',
  day: 'Mon',
  type: 'court',
  color: 'bg-pink-400'
}, {
  id: 2,
  title: 'Health Check-In',
  startTime: '12:30',
  endTime: '14:00',
  day: 'Mon',
  type: 'coaching',
  color: 'bg-purple-400'
}, {
  id: 3,
  title: 'Lab Test Appointment',
  startTime: '14:00',
  endTime: '16:00',
  day: 'Tue',
  type: 'court',
  color: 'bg-orange-400'
}, {
  id: 4,
  title: 'Specialist Referral',
  startTime: '10:00',
  endTime: '12:00',
  day: 'Wed',
  type: 'coaching',
  color: 'bg-green-400'
}, {
  id: 5,
  title: 'Surgery Schedule',
  startTime: '15:00',
  endTime: '17:00',
  day: 'Wed',
  type: 'court',
  color: 'bg-blue-400'
}, {
  id: 6,
  title: ' Therapy Session',
  startTime: '09:00',
  endTime: '10:30',
  day: 'Thu',
  type: 'coaching',
  color: 'bg-teal-400'
}, {
  id: 7,
  title: '	Medical Equipment Maintenance',
  startTime: '13:00',
  endTime: '14:00',
  day: 'Fri',
  type: 'maintenance',
  color: 'bg-gray-400'
},
{
  id: 8,
  title: 'Medical Check-Up',
  startTime: '10:00',
  endTime: '12:00',
  day: 'Sat',
  type: 'maintenance',
  color: 'bg-rose-400'
}
];
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const LiveScheduleCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const getTimePosition = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    return (hour - 8) * 100 / (timeSlots.length - 1);
  };
  const getDuration = (startTime: string, endTime: string) => {
    const start = parseInt(startTime.split(':')[0]) + parseInt(startTime.split(':')[1]) / 60;
    const end = parseInt(endTime.split(':')[0]) + parseInt(endTime.split(':')[1]) / 60;
    return (end - start) * 100 / (timeSlots.length - 1);
  };
  return <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Live Schedule Calendar</h3>
        <div className="flex items-center gap-2">
          <button  >
            <ChevronLeft className="h-4 w-4 text-black" />
          </button>
          <span className="text-sm text-black font-semibold px-3">Week {currentWeek + 1}</span>
          <button  >
            <ChevronRight className="h-4 w-4 text-black  " />
          </button>
          
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Time header */}
          <div className="flex border-b border-gray-200 pb-2 mb-4">
            <div className="w-20 text-sm font-medium text-gray-600">Time</div>
            <div className="flex-1 grid grid-cols-11 gap-2">
              {timeSlots.map((time, index) => <div key={index} className="text-xs text-gray-500 text-center">
                  {time}
                </div>)}
            </div>
          </div>

          {/* Schedule grid */}
          <div className="space-y-3">
            {days.map((day, dayIndex) => <div key={day} className="flex  items-center">
                <div className="w-20 text-sm font-medium text-gray-700">
                  {day}
                </div>
                <div className="flex-1 relative h-12 bg-gray-50 rounded-lg">
                  {/* Time grid lines */}
                  <div className="absolute inset-0 grid grid-cols-11">
                    {timeSlots.map((_, index) => <div key={index} className="border-r border-gray-200 last:border-r-0"></div>)}
                  </div>
                  
                  {/* Schedule items */}
                  {scheduleData.filter(item => item.day === day).map((item, index) => <div key={item.id} className={`absolute ${item.color} rounded-md text-center  px-2 py-1 text-xs text-white font-medium shadow-sm hover:shadow-md transition-shadow cursor-pointer`} style={{
                left: `${getTimePosition(item.startTime)}%`,
                width: `${getDuration(item.startTime, item.endTime)}%`,
                top: index * 16 + 2,
                height: '25px',
                zIndex: 10
              }} title={`${item.title} (${item.startTime} - ${item.endTime})`}>
                        <div className="truncate">
                          {item.title}
                        </div>
                      </div>)}
                </div>
              </div>)}
          </div>

          {/* Legend */}
          <div className="flex gap-10 mt-6 text-base">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-3 h-3 bg-pink-400 rounded "></div>
              <span>	General Consultation</span>
            </div>
            <div className="flex items-center gap-2  text-gray-600">
              <div className="w-3 h-3 bg-purple-400 rounded"></div>
              <span>	Surgery Schedule</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-3 h-3 bg-gray-400 rounded"></div>
              <span>	Medical Equipment Maintenance</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default LiveScheduleCalendar;