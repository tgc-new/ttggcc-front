'use client';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';

const MONTHS_EN = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const DAYS_EN   = ['M','T','W','T','F','S','S'];

export default function CalendarWidget() {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const startDay    = firstDay === 0 ? 6 : firstDay - 1;

  const prevMonth = () => { if (month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); };
  const nextMonth = () => { if (month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); };

  const isToday = d => d===today.getDate() && month===today.getMonth() && year===today.getFullYear();

  return (
    <div className="card overflow-hidden">
      <div className="section-title">
        <FaCalendarAlt size={14}/>
        <span>Calendar</span>
      </div>
      <div className="p-3">
        {/* Month/year header */}
        <div className="flex items-center justify-between mb-3 text-white rounded-lg px-3 py-2"
          style={{ background:'linear-gradient(90deg,#B71C1C,#C62828)' }}>
          <button onClick={prevMonth} aria-label="আগের মাস" className="hover:text-yellow-300 transition-colors p-1 rounded hover:bg-white/10">
            <FaChevronLeft size={12}/>
          </button>
          <span className="text-sm font-bold tracking-wide">{MONTHS_EN[month]} {year}</span>
          <button onClick={nextMonth} aria-label="পরের মাস" className="hover:text-yellow-300 transition-colors p-1 rounded hover:bg-white/10">
            <FaChevronRight size={12}/>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {DAYS_EN.map((d,i)=>(
            <div key={i} className="text-center text-xs text-gray-400 font-semibold py-1">{d}</div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({length:startDay}).map((_,i)=><div key={`e${i}`}/>)}
          {Array.from({length:daysInMonth}).map((_,i)=>{
            const d = i+1;
            return (
              <div key={d}
                className={`text-center text-xs py-1.5 rounded cursor-default transition-colors font-medium
                  ${isToday(d) ? 'text-white font-bold shadow-sm' : 'hover:bg-gray-100 text-gray-700'}`}
                style={isToday(d) ? { background:'#C62828' } : undefined}>
                {d}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
