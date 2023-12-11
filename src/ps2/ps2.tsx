import { useState } from "react";
import { Tab, Tabs } from "@mui/material";

import { PS2_TABS } from "../config/ps2";
import FirstExercise from "./FirstExercise/FirstExercise";

const PS2 = () => {
  return (
    <div>
      <FirstExercise />
    </div>
  );
};

export default PS2;
