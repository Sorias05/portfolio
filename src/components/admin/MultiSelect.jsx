"use client";
import { noImage2 } from "@/constants";
import React, { useState, useRef, useEffect } from "react";

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
}) {
  const selected = Array.isArray(value) ? value : [];

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  const toggle = (val) =>
    selected.includes(val)
      ? onChange(selected.filter((v) => v !== val))
      : onChange([...selected, val]);

  return (
    <div className="relative w-full" ref={ref}>
      <div
        className="
          flex flex-wrap items-center gap-2 
          rounded-md p-2
          bg-black-300
        "
        onClick={() => setOpen((o) => !o)}
      >
        {selected.map((val) => {
          const opt = options?.find((o) => o.value._id === val._id);
          return (
            <span
              key={val._id}
              className="px-2 py-1 rounded text-xs flex items-center gap-1 border border-gray-400"
              style={{
                color: opt?.value.isDark ? "#fff" : "#111",
                background: opt?.value.color,
              }}
            >
              <img
                src={opt?.value.image || noImage2}
                alt={opt?.label}
                className="w-4 h-4"
              />
              {opt?.label}
              <button
                type="button"
                className="ml-1"
                style={{
                  color: opt?.value.isDark ? "#fff" : "#111",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(val);
                }}
              >
                ×
              </button>
            </span>
          );
        })}

        <input
          type="text"
          className="flex-1 outline-none py-1 px-2 text-sm bg-black-300"
          placeholder={selected.length ? "" : placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        />

        <div className="ml-2">
          <svg
            className={`w-4 h-4 transition-transform text-white ${
              open ? "rotate-180" : "rotate-0"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {open && (
        <div className="absolute flex flex-wrap gap-2 z-10 mt-1 w-full bg-black-300 p-2 shadow-lg rounded-md max-h-60 overflow-auto text-sm">
          {filtered?.length === 0 && (
            <div className="p-2 text-white">No options</div>
          )}
          {filtered?.map((opt) => {
            const isSel = selected.includes(opt.value);
            return (
              <div
                key={opt.value._id}
                className={`
                  px-2 py-1 rounded text-xs flex items-center gap-1 border border-gray-400 cursor-pointer
                  ${isSel ? "bg-indigo-100 font-semibold" : "hover:bg-gray-100"}
                `}
                onClick={() => toggle(opt.value)}
                style={{
                  color: opt.value.isDark ? "#fff" : "#111",
                  background: opt.value.color,
                }}
              >
                <img
                  src={opt.value.image || noImage2}
                  alt={opt.label}
                  className="w-4 h-4"
                />
                <span>{opt.label}</span>
                {isSel && (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    style={{ color: opt.value.isDark ? "#fff" : "#111" }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 01.083 1.32l-.083.094L8.707 14.588a1 1 0 01-1.32.083l-.094-.083L3.29 10.293a1 1 0 011.32-1.497l.094.083L8 12.584l7.293-7.293a1 1 0 011.32-.083z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
