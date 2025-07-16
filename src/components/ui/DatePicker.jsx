"use client";
import React, { useRef, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const DatePickerComponents = ({ label }) => {
  const dateInputRef = useRef(null);
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div className="flex flex-col gap-2 w-full text-white">
      <label className="text-lg max-xs:text-sm">{`Date of Birth`}</label>
      <div className="input-border relative">
         <FaRegCalendarAlt
          className="absolute end-4 z-[2000] top-1/2 transform -translate-y-1/2 text-secondary text-lg cursor-pointer"
          onClick={() => dateInputRef.current?.showPicker()}
        />
        <DatePicker
          className=" flex h-12 !w-full placeholder:!text-[#6D83B6] placeholder:!text-base  appearance-none !rounded-[10px] z-[1000]  !bg-[#040613e0]   px-3 py-2 text-base ring-offset-background  file:bg-transparent file:text-sm file:font-medium file:text-foreground  focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50 md:text-sm  focus:border-none focus:outline-none"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
      </div>
    </div>
  );
};

export default DatePickerComponents;
