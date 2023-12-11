import { convertToRGB } from "../ColorPickerInput/utils";
import { AVAILABLE_COLORS } from "../ps2";

describe("converter tests", () => {
  describe("convert to rgb tests", () => {
    describe("convert from hsv to rgb tests", () => {
      it("should return rgb(255,0,0) when hsv(0,100,100) is passed", () => {
        expect(
          convertToRGB({
            type: AVAILABLE_COLORS.hsv,
            color: { h: 0, s: 100, v: 100 },
          })
        ).toBe({
          r: 255,
          g: 0,
          b: 0,
        });
      });
    });
  });
});
