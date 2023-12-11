import { Slider } from "@mui/material";
import React from "react";

type Props = {
  rgb: { red: number; green: number; blue: number };
  onRGBChange: (rgb: { red: number; green: number; blue: number }) => void;
};

const RGBPicker: React.FC<Props> = (props) => {
  const { onRGBChange, rgb } = props;

  const handleChange = (e: Event) => {
    const { target } = e;
    if (target !== null) {
      onRGBChange({
        ...rgb,
        //@ts-expect-error bad typing in mui
        [target.name]: target.value,
      });
    }
  };

  return (
    <div>
      <span>Red</span>
      <Slider
        onChange={handleChange}
        name="red"
        valueLabelDisplay="auto"
        min={0}
        max={255}
      />
      <span>Green</span>
      <Slider
        onChange={handleChange}
        name="green"
        valueLabelDisplay="auto"
        min={0}
        max={255}
      />
      <span>Blue</span>
      <Slider
        onChange={handleChange}
        name="blue"
        valueLabelDisplay="auto"
        min={0}
        max={255}
      />
    </div>
  );
};

export default RGBPicker;
