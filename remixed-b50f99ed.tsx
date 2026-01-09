import React, { useState } from 'react';
import { Clock, MapPin, Plus, X, Calendar } from 'lucide-react';

const TimeConverter = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('12:00');
  const [baseTimezone, setBaseTimezone] = useState('America/New_York');
  const [timezones, setTimezones] = useState([
    { id: 1, zone: 'America/New_York', label: 'New York' },
    { id: 2, zone: 'Europe/London', label: 'London' },
    { id: 3, zone: 'Asia/Tokyo', label: 'Tokyo' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const commonTimezones = [
    { zone: 'America/New_York', label: 'New York (EST/EDT)' },
    { zone: 'America/Chicago', label: 'Chicago (CST/CDT)' },
    { zone: 'America/Denver', label: 'Denver (MST/MDT)' },
    { zone: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
    { zone: 'America/Phoenix', label: 'Phoenix (MST)' },
    { zone: 'America/Anchorage', label: 'Anchorage (AKST/AKDT)' },
    { zone: 'Pacific/Honolulu', label: 'Honolulu (HST)' },
    { zone: 'Europe/London', label: 'London (GMT/BST)' },
    { zone: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { zone: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
    { zone: 'Europe/Rome', label: 'Rome (CET/CEST)' },
    { zone: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
    { zone: 'Europe/Moscow', label: 'Moscow (MSK)' },
    { zone: 'Asia/Dubai', label: 'Dubai (GST)' },
    { zone: 'Asia/Kolkata', label: 'Mumbai/Delhi (IST)' },
    { zone: 'Asia/Shanghai', label: 'Beijing/Shanghai (CST)' },
    { zone: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { zone: 'Asia/Seoul', label: 'Seoul (KST)' },
    { zone: 'Asia/Singapore', label: 'Singapore (SGT)' },
    { zone: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
    { zone: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
    { zone: 'Australia/Melbourne', label: 'Melbourne (AEDT/AEST)' },
    { zone: 'Pacific/Auckland', label: 'Auckland (NZDT/NZST)' },
    { zone: 'America/Toronto', label: 'Toronto (EST/EDT)' },
    { zone: 'America/Vancouver', label: 'Vancouver (PST/PDT)' },
    { zone: 'America/Mexico_City', label: 'Mexico City (CST/CDT)' },
    { zone: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
    { zone: 'America/Buenos_Aires', label: 'Buenos Aires (ART)' },
    { zone: 'Africa/Cairo', label: 'Cairo (EET)' },
    { zone: 'Africa/Johannesburg', label: 'Johannesburg (SAST)' }
  ];

  const getBaseDateTime = () => {
    const dateTimeString = `${selectedDate}T${selectedTime}:00`;
    return new Date(dateTimeString + 'Z');
  };

  const convertTime = (targetTimezone) => {
    try {
      const dateTimeString = `${selectedDate}T${selectedTime}:00`;
      const parser = new Date(dateTimeString);
      
      const baseFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: baseTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      const baseParts = baseFormatter.formatToParts(parser);
      const baseYear = baseParts.find(p => p.type === 'year').value;
      const baseMonth = baseParts.find(p => p.type === 'month').value;
      const baseDay = baseParts.find(p => p.type === 'day').value;
      const baseHour = baseParts.find(p => p.type === 'hour').value;
      const baseMinute = baseParts.find(p => p.type === 'minute').value;
      
      const baseISOString = `${baseYear}-${baseMonth}-${baseDay}T${baseHour}:${baseMinute}:00`;
      const baseDate = new Date(baseISOString);
      
      const baseOffset = -parser.getTimezoneOffset();
      const actualBaseDate = new Date(parser.getTime() - baseOffset * 60000);
      
      const baseUTC = Date.parse(baseISOString) - getTimezoneOffset(baseTimezone, baseDate);
      const targetDate = new Date(baseUTC + getTimezoneOffset(targetTimezone, new Date(baseUTC)));
      
      return targetDate;
    } catch (e) {
      return null;
    }
  };

  const getTimezoneOffset = (timezone, date) => {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return tzDate.getTime() - utcDate.getTime();
  };

  const formatTime = (date) => {
    if (!date) return 'Invalid';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatDate = (date) => {
    if (!date) return 'Invalid';
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatDateTime = (date, timezone) => {
    if (!date) return { time: 'Invalid', date: 'Invalid' };
    
    try {
      const dateTimeString = `${selectedDate}T${selectedTime}:00`;
      const inputDate = new Date(dateTimeString);
      
      const sourceFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: baseTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      const targetFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      const sourceParts = sourceFormatter.formatToParts(inputDate);
      const targetParts = targetFormatter.formatToParts(inputDate);
      
      const getPartValue = (parts, type) => parts.find(p => p.type === type)?.value || '00';
      
      const sourceMS = Date.UTC(
        parseInt(getPartValue(sourceParts, 'year')),
        parseInt(getPartValue(sourceParts, 'month')) - 1,
        parseInt(getPartValue(sourceParts, 'day')),
        parseInt(getPartValue(sourceParts, 'hour')),
        parseInt(getPartValue(sourceParts, 'minute')),
        parseInt(getPartValue(sourceParts, 'second'))
      );
      
      const targetMS = Date.UTC(
        parseInt(getPartValue(targetParts, 'year')),
        parseInt(getPartValue(targetParts, 'month')) - 1,
        parseInt(getPartValue(targetParts, 'day')),
        parseInt(getPartValue(targetParts, 'hour')),
        parseInt(getPartValue(targetParts, 'minute')),
        parseInt(getPartValue(targetParts, 'second'))
      );
      
      const diff = sourceMS - targetMS;
      const adjustedDate = new Date(inputDate.getTime() - diff);
      
      const time = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(adjustedDate);
      
      const dateStr = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(adjustedDate);
      
      return { time, date: dateStr };
    } catch (e) {
      return { time: 'Invalid', date: 'Invalid' };
    }
  };

  const addTimezone = (zone, label) => {
    if (zone && !timezones.find(tz => tz.zone === zone)) {
      setTimezones([...timezones, { 
        id: Date.now(), 
        zone, 
        label: label || zone.split('/').pop().replace(/_/g, ' ')
      }]);
      setSearchTerm('');
    }
  };

  const removeTimezone = (id) => {
    if (timezones.length > 1) {
      setTimezones(timezones.filter(tz => tz.id !== id));
    }
  };

  const filteredTimezones = commonTimezones.filter(tz =>
    tz.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tz.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const baseTimezoneLabel = commonTimezones.find(tz => tz.zone === baseTimezone)?.label || baseTimezone;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Clock className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Time Converter</h1>
          </div>
          <p className="text-gray-600">Set a time in one location and see what time it is everywhere else</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Set Your Time
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">In Time Zone</label>
              <select
                value={baseTimezone}
                onChange={(e) => setBaseTimezone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {commonTimezones.map((tz) => (
                  <option key={tz.zone} value={tz.zone}>{tz.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Location to Compare
          </h2>
          
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search location or time zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {searchTerm && (
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredTimezones.length > 0 ? (
                filteredTimezones.map((tz) => (
                  <button
                    key={tz.zone}
                    onClick={() => addTimezone(tz.zone, tz.label)}
                    className="w-full text-left px-4 py-2 hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-800">{tz.label}</div>
                    <div className="text-sm text-gray-500">{tz.zone}</div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center">
                  No matching time zones found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {timezones.map((tz) => {
            const converted = formatDateTime(getBaseDateTime(), tz.zone);
            const isBase = tz.zone === baseTimezone;
            
            return (
              <div 
                key={tz.id} 
                className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow ${isBase ? 'ring-2 ring-indigo-500' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-5 h-5 ${isBase ? 'text-indigo-600' : 'text-gray-600'}`} />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{tz.label}</h3>
                      {isBase && <span className="text-xs text-indigo-600 font-medium">Reference Time Zone</span>}
                    </div>
                  </div>
                  {!isBase && (
                    <button
                      onClick={() => removeTimezone(tz.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove timezone"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-indigo-600 tabular-nums">
                    {converted.time}
                  </div>
                  <div className="text-sm text-gray-500">
                    {tz.zone}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>All times automatically convert based on your reference time zone</p>
        </div>
      </div>
    </div>
  );
};

export default TimeConverter;