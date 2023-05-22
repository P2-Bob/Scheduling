// components/DayGridTable.js
import React, { useState, useEffect } from 'react';
import styles from '@/styles/dayGridTable.module.css';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { useMediaQuery } from '../../../lib/mediaQuery';

const WeekGridTable = ({schedule, shiftName, users, startDate}) => {

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Get the current week as a string
    const weekString = (startDate, endDate) => {
        return `${startDate.toDateString()} - ${endDate.toDateString()}`;
    };

    // Calculate the start and end date of the week for a specific date
    const calculateWeek = (date) => {
        const start = new Date(date);
        start.setDate(start.getDate() - (start.getDay() + 6) % 7);
        
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        
        return [start, end];
    };
    

    // State for the displayed week
    const [displayedWeek, setDisplayedWeek] = useState(calculateWeek(startDate));

    let events = [];
    schedule.forEach((shift) => {
        const shift1 = shiftName.filter((shifts) => shifts.shift_id === shift.shift_id);
        console.log("shift1", shift1)
        const user = users.find((user) => user.username === shift.username);
        if (user.age < 18) {
            events.push(
                {
                    date: new Date(shift.date),
                    description: `${user.name}: Shift from ${shift1[0].shift_time}`,
                    shift_id: shift.shift_id,
                    over18: false
                });
        } else {
            events.push(
                {
                    date: new Date(shift.date),
                    description: `${user.name}: Shift from ${shift1[0].shift_time}`,
                    shift_id: shift.shift_id,
                    over18: true
                });
        }
    });

    // Sort events by shift_id
    events.sort((a, b) => a.shift_id - b.shift_id);

    // Add useEffect to update the dayGrid when displayedWeek changes
    useEffect(() => {
        setDayGrid(generateDayGrid());
    }, [displayedWeek]);

    const generateDayGrid = () => {
        const grid = [];
        const startDate = new Date(displayedWeek[0]);
        
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            grid.push(currentDate);
        }
      
        return [grid];
    };
    
      
    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const [dayGrid, setDayGrid] = useState(generateDayGrid());

    // Functions to handle click events for each arrow
    const handlePrevWeekClick = () => {
        const newWeekStart = new Date(displayedWeek[0]);
        newWeekStart.setDate(newWeekStart.getDate() - 7);
        setDisplayedWeek(calculateWeek(newWeekStart));
    };

    const handleNextWeekClick = () => {
        const newWeekStart = new Date(displayedWeek[0]);
        newWeekStart.setDate(newWeekStart.getDate() + 7);
        setDisplayedWeek(calculateWeek(newWeekStart));
    };

    const handleTodayClick = () => {
        setDisplayedWeek(calculateWeek(new Date()));
    };

    return (
        <div>
            {/* Week header */}
            <div className={styles.monthYearHeader}>
                {weekString(displayedWeek[0], displayedWeek[1])}
                <div className={styles.monthButtons}>
                    <button className={styles.todayButton} onClick={handleTodayClick}>Today</button>
                    <MdKeyboardArrowLeft className={styles.arrow} onClick={handlePrevWeekClick} />
                    <MdKeyboardArrowRight className={styles.arrow} onClick={handleNextWeekClick} />
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
                        {week.map((date, index) => (
                            <div
                                key={index}
                                className={`${styles.dayGridCellWeek} ${
                                    index === 5 ? styles.dayGridSat : index === 6 ? styles.dayGridSun : ''
                                } ${isToday(date) ? styles.dayGridToday : ''}`}                                
                            >
                                {useMediaQuery(768) ? daysOfWeek[index] : ("")} {date.getDate()}
                                {events.map((event, index) => {
                                    if (
                                        event.date.getFullYear() === date.getFullYear() &&
                                        event.date.getMonth() === date.getMonth() &&
                                        event.date.getDate() === date.getDate()
                                    ) {
                                        const descriptionParts = event.description.split(':');
                                        const formattedDescription = (
                                            <>
                                                {descriptionParts[0]}:<br />
                                                {descriptionParts[1]}
                                            </>
                                        );
                                        if (event.over18 === true) {
                                            return (
                                                
                                                <div key={index} className={`${styles.event} ${styles.over18}`}>
                                                    {formattedDescription}
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div key={index} className={styles.event}>
                                                    {formattedDescription}
                                                </div>
                                            );
                                        }
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

export default WeekGridTable;