import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./multiRangeSlider.scss";
import MultiRangeTypes from "./MultiRangeTypes";

// Adapted from https://codesandbox.io/p/sandbox/multi-range-slider-react-js-6rzv0f
const MultiRangeSlider = ({ min, max, onChange, idx, type }) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const [typeVal, setTypeVal] = useState(type);
    const minValRef = useRef(min);
    const maxValRef = useRef(max);
    const range = useRef(null);

    // Convert to percentage
    const getPercent = useCallback(
        (value) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    function getTimestamp(value)  {
        let minutes = Math.floor(value / 60000);
        let seconds = Math.floor((value / 1000) % 60);
        return `${minutes}:${(seconds < 10) ? `0${seconds}` : seconds}`
    }

    // Set width of the range to decrease from the left side
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    // Get min and max values when their state changes
    useEffect(() => {
        onChange(idx, { min: minVal, max: maxVal });
    }, [minVal, maxVal, onChange]);

    return (
        <div>
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                onChange={(event) => {
                    const value = Math.min(Number(event.target.value), maxVal - 1);
                    setMinVal(value);
                    minValRef.current = value;
                }}
                className="thumb thumb--left"
                style={{ zIndex: minVal > max - 100 && "5" }}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                onChange={(event) => {
                    const value = Math.max(Number(event.target.value), minVal + 1);
                    setMaxVal(value);
                    maxValRef.current = value;
                }}
                className="thumb thumb--right"
            />

            <div className="slider">
                <div className="slider__track" />
                <div ref={range} className="slider__range" />
                <div className="slider__left-value">{(typeVal == MultiRangeTypes.MS_TO_TIMESTAMPS) ? getTimestamp(minVal) : minVal}</div>
                <div className="slider__right-value">{(typeVal == MultiRangeTypes.MS_TO_TIMESTAMPS) ? getTimestamp(maxVal) : maxVal}</div>
            </div>
        </div>
    );
};

MultiRangeSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired
};

export default MultiRangeSlider;
