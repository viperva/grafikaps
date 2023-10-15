import { Box, Typography } from "@mui/material";

const Credits = () => {
  return (
    <Box>
      <Typography variant="h3">
        Zestawienie implementacji zadań z przedmiotu Grafika kompueterowa
      </Typography>
      <Typography mt={2} variant="h5">
        Politechnika Białostocka, Semestr VII, Informatyka
      </Typography>
      <Typography mt={6} variant="h3">
        Autorzy: Adam Brzozowski, Filip Białowąs
      </Typography>
    </Box>
  );
};

export default Credits;
