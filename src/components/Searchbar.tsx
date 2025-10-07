"use client";

import { useState, ChangeEvent } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export const SearchInput = ({ onSearch }: SearchInputProps) => {
  const [inputValue, setValue] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setValue(val);
    onSearch(val); 
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") onSearch(inputValue);
  };

  return (
    <div className="border-[2px] font-bold text-indigo-900 border-solid bg-slate-200 border-slate-500 flex flex-row items-center ml-6 gap-5 p-1 mt-4 rounded-2xl">
      <input
        type="text"
        placeholder="Search for Movies"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        className="bg-transparent outline-none border-none w-[20rem] py-3 pl-3 pr-3"
      />
    </div>
  );
};
