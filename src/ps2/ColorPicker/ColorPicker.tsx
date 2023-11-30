import { RgbColor, RgbColorPicker } from "react-colorful";

type Props = {
  onChange: (color: RgbColor) => void;
  color: RgbColor;
};

const ColorPicker: React.FC<Props> = (Props) => {
  const { onChange, color } = Props;

  return (
    <>
      <RgbColorPicker
        style={{
          width: "300px",
          height: "300px",
        }}
        color={color}
        onChange={onChange}
      />
    </>
  );
};

export default ColorPicker;
