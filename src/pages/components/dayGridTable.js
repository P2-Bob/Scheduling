// components/DayGridTable.js
import React, { useState, useEffect } from 'react';
import styles from '@/styles/dayGridTable.module.css';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const DayGridTable = ({schedule, shiftName}) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const today = currentDate.getDate();
    

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Get the current month and year as a string
    const monthYearString = (month, year) => {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${monthNames[month]} ${year}`;
    };

    // State for the displayed month and year
    const [displayedMonth, setDisplayedMonth] = useState(currentMonth);
    const [displayedYear, setDisplayedYear] = useState(currentYear);

    let events = [];
    // Hardcoded list of events
    schedule.forEach((shift) => {
        const shift1 = shiftName.filter((shifts) => shifts.shift_id === shift.shift_id);
        events.push({ date: new Date(shift.date), description: `Shift from ${shift1[0].shift_time}`});
    });
 
    // Find events for a specific day
    const eventsForDay = (day) => {
        if (!day) return [];
        return events.filter(
        (event) => event.date.getDate() === day && event.date.getMonth() === currentMonth && event.date.getFullYear() === currentYear
        );
    };

    // Add useEffect to update the dayGrid when displayedMonth or displayedYear changes
    useEffect(() => {
        setDayGrid(generateDayGrid(displayedMonth, displayedYear));
    }, [displayedMonth, displayedYear]);

    const generateDayGrid = () => {
        const grid = [];
        const firstDayOfMonth = new Date(displayedYear, displayedMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        let startDay = firstDayOfMonth.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1;
        const totalWeeks = 6;
        let dayCounter = 1 - startDay;
    
        for (let i = 0; i < totalWeeks; i++) {
          const week = [];
          for (let j = 0; j < 7; j++) {
            const currentDay = dayCounter++;
            if (currentDay > 0 && currentDay <= daysInMonth) {
              week.push(currentDay);
            } else {
              week.push(null);
            }
          }
          grid.push(week);
        }
    
        return grid;
    };
    
      
  
    const isToday = (day, month, year) => {
        if (!day) return false;
        const today = new Date();
        return (
          day === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear()
        );
    };

    const [dayGrid, setDayGrid] = useState(generateDayGrid(displayedMonth, displayedYear));

    // Functions to handle click events for each arrow
    const handlePrevMonthClick = () => {
        if (displayedMonth === 0) {
        setDisplayedMonth(11);
        setDisplayedYear(displayedYear - 1);
        } else {
        setDisplayedMonth(displayedMonth - 1);
        }
    };

    const handleNextMonthClick = () => {
        if (displayedMonth === 11) {
        setDisplayedMonth(0);
        setDisplayedYear(displayedYear + 1);
        } else {
        setDisplayedMonth(displayedMonth + 1);
        }
    };

    const handleTodayClick = () => {
        setDisplayedMonth(currentMonth);
        setDisplayedYear(currentYear);
    };


    return (
      <div>
        {/* Month and year header */}
        <div className={styles.monthYearHeader}>
            {monthYearString(displayedMonth, displayedYear)}
                <div className={styles.monthButtons}>
                <button className={styles.todayButton} onClick={handleTodayClick}>Today</button>
                <MdKeyboardArrowLeft className={styles.arrow} onClick={handlePrevMonthClick} />
                <MdKeyboardArrowRight className={styles.arrow} onClick={handleNextMonthClick} />
            </div>
        </div>
        
        <div className={styles.dayGridContainer}>
            <div className={styles.dayGridHeader}>
                {daysOfWeek.map((day, index) => (
                    <div key={index} className={styles.dayGridHeaderCell}>
                        {day}
                    </div>
                ))}
            </div>
            <div className={`${styles.dayGridBody} ${styles.dayGridContainer}`}>
                {dayGrid.map((week, index) => (
                <div key={index} className={styles.dayGridWeek}>
                    {week.map((day, index) => (
                        <div
                            key={index}
                            className={`${styles.dayGridCell} ${isToday(day, displayedMonth, displayedYear) ? styles.dayGridToday : ''}`}
                            >
                            {day}
                            {events.map((event, index) => {
                            const eventDate = event.date;
                            if (
                                eventDate.getFullYear() === displayedYear &&
                                eventDate.getMonth() === displayedMonth &&
                                eventDate.getDate() === day
                            ) {
                                return (
                                <div key={index} className={styles.event}>
                                    {event.description}
                                </div>
                                );
                            }
                            return null;
                            })}
                        </div>
                    ))}
                </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default DayGridTable;
