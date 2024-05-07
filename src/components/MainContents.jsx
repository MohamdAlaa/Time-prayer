import { Button, Divider, Stack, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Prayer from "./Prayer";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const MainContents = () => {
  //Stats
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [newciry, setNewCity] = useState("");
  const [date, setDate] = useState("");
  const [nextPrayerIndex, setNextPrayerIndex] = useState(2);

  const [timings, setTiminig] = useState({
    Fajr: "04:30",
    Dhuhr: "12:51",
    Asr: "16:28",
    Sunset: "19:36",
    Isha: "21:02",
  });

  const prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Sunset", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];

  const getTimings = async () => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=${country}&city=${city}`
    );
    setTiminig(response.data.data.timings);
    setNewCity(city);
    setCountry("");
    setCity("");
  };

  useEffect(() => {
    const today = moment();
    setDate(today.format("MMM Do YYYY | h:mm"));

    const interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const setupCountdownTimer = () => {
    const momentNow = moment();
    let PrayerIndex = 2;

    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      PrayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      PrayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))
    ) {
      PrayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      PrayerIndex = 4;
    } else {
      PrayerIndex = 0;
    }

    setNextPrayerIndex(PrayerIndex);

    // TODO i will start the video from  2:40:00
  };

  const handleButtonClick = () => {
    if (country && city) {
      getTimings();
    } else {
      alert("Please fill in both country and city.");
    }
  };

  return (
    <>
      {/*===> First Row <===*/}
      <Grid container>
        <Grid xs={6}>
          <div>
            <h2>{date}</h2>
            <h1 style={{ textTransform: "capitalize" }}>{newciry}</h1>
          </div>
        </Grid>
        <Grid xs={5}>
          <div>
            <h2>
              الصلاة القادمه هي صلاة {prayersArray[nextPrayerIndex].displayName}
            </h2>
            <h1>00.10.28</h1>
          </div>
        </Grid>
      </Grid>
      <Divider className="divider" />
      {/*===> Scound Row <===*/}
      <Stack className="prayer-satck-container" direction={"row"}>
        <Prayer
          name="الفجر"
          time={timings.Fajr}
          img="https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2"
        />
        <Prayer
          name="الظهر"
          time={timings.Dhuhr}
          img="https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921"
        />
        <Prayer
          name="العصر"
          time={timings.Asr}
          img="https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf"
        />
        <Prayer
          name="المغرب"
          time={timings.Sunset}
          img="https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5"
        />
        <Prayer
          name="العشاء"
          time={timings.Isha}
          img="https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d"
        />
      </Stack>
      {/*===> third Row <===*/}
      <Stack direction="row" className="third-row">
        <TextField
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          id="outlined-basic"
          label="Enter your country"
          variant="outlined"
        />
        <TextField
          value={city}
          onChange={(e) => setCity(e.target.value)}
          id="outlined-basic"
          label="Enter your city"
          variant="outlined"
        />
        <Button
          variant="contained"
          className="submit"
          onClick={handleButtonClick}
        >
          Get Timings
        </Button>
      </Stack>
    </>
  );
};

export default MainContents;
