import { Button, Divider, Stack, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Prayer from "./Prayer";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const MainContent = () => {
  //Stats
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [newciry, setNewCity] = useState("cairo");
  const [date, setDate] = useState("");
  const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
  const [remainingTime, setRemainingTime] = useState("");

  const [timings, setTiminig] = useState({
    Fajr: "04:29",
    Dhuhr: "12:51",
    Asr: "16:28",
    Sunset: "19:37",
    Isha: "21:03",
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
  const handleButtonClick = () => {
    if (country && city) {
      getTimings();
    } else {
      alert("Please fill in both country and city.");
    }
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
  }, [timings]);

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

    const nextPrayerObject = prayersArray[PrayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );

      const totalDiffernce = midnightDiff + fajrToMidnightDiff;

      remainingTime = totalDiffernce;
    }

    const durationRemainingTime = moment.duration(remainingTime);

    setRemainingTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
    );
  };

  return (
    <>
      {/*===> First Row <===*/}
      <Grid container style={{ direction: "rtl" }}>
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
            <h1>{remainingTime}</h1>
          </div>
        </Grid>
      </Grid>
      <Divider className="divider" />
      {/*===> Scound Row <===*/}
      <Stack className="prayer-satck-container">
        <Prayer name="الفجر" time={timings.Fajr} img="/fajr.webp" />
        <Prayer name="الظهر" time={timings.Dhuhr} img="/dhhr.webp" />
        <Prayer name="العصر" time={timings.Asr} img="/asr.webp" />
        <Prayer name="المغرب" time={timings.Sunset} img="/sunset.webp" />
        <Prayer name="العشاء" time={timings.Isha} img="/night.webp" />
      </Stack>
      {/*===> third Row <===*/}
      <Stack direction="row" className="third-row" style={{ direction: "rtl" }}>
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

export default MainContent;
