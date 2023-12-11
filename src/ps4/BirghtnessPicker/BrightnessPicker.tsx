import { Slider } from "@mui/material";
import React from "react";

type Props = {
  onBrightnessChange: (brightness: number) => void;
};

const BirghtnessPicker: React.FC<Props> = (props) => {
  const { onBrightnessChange } = props;
  const handleChange = (e: Event) => {
    const { target } = e;
    if (target === null) return;
    //@ts-expect-error bad typing in mui
    onBrightnessChange(target.value);
  };

  return (
    <div>
      <span>Brightness</span>
      <Slider
        valueLabelDisplay="auto"
        onChange={handleChange}
        min={0}
        max={200}
      />
    </div>
  );
};

export default BirghtnessPicker;
