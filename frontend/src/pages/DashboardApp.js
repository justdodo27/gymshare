import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
  AppStatistics
} from '../sections/@dashboard/app';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useSelector} from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { authActions } from '../store/auth';
import { Button } from '@mui/material';
import { month } from 'src/sections/@dashboard/app/AppWebsiteVisits';
import { ConnectingAirportsOutlined } from '@mui/icons-material';


// ----------------------------------------------------------------------

export default function DashboardApp() {

  function getMonth(date) {
    var month = date.getMonth() + 1;
    return month < 10 ? '0' + month : '' + month; // ('' + month) for string result
  }  

  function getDay(date) {
    var month = date.getDate();
    return month < 10 ? '0' + month : '' + month; // ('' + month) for string result
  }

  let month= useSelector(state => state.month.month);

  let dayCheck= useSelector(state => state.day.day);
  console.log(dayCheck)

  const dispatch = useDispatch()
  let exp = useSelector(state => state.auth.exp);
  const navigate = useNavigate()

  useEffect(() => {
    if (exp<parseInt(Date.now()/1000)) {
      dispatch(authActions.logout())
      navigate('/', {replace: true});
    }
  }, [dispatch, exp, navigate]);

  const theme = useTheme();
  let token = useSelector(state => state.auth.token);
  const [caloriesToday, setCaloriesToday] = useState(0)
  const [exercisesToday, setExercisesToday] = useState([])
  const [time, setTime] = useState([])
  const [pastDays, setPastDays] = useState([])
  const [caloriesDays, setCaloriesDays] = useState([])
  const [avgCalories, setAvgCalories] = useState("")

  let year = new Date().getFullYear() 

  const fetchExercises = useCallback(async () => {
    
    try {
      const response = await fetch(global.config.url+ "stats/stats_exercise/", {
      method: 'GET',
      headers: {
      Authorization: "Bearer " +token
      }
    });
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const temp = await response.json();
  
      

      const days_exercise = [...Array(temp.length)].map((_, index) => ({
        id: temp[index].id,
        day: temp[index].date,
        repeats: temp[index].repeats,
        time: temp[index].time,
        exerciseId: temp[index].exercise.title
      }));

      

      const nowDate = new Date(); 
      function getMonth(date) {
        var month = date.getMonth() + 1;
        return month < 10 ? '0' + month : '' + month; // ('' + month) for string result
      }  

      function getDay(date) {
        var month = date.getDate();
        return month < 10 ? '0' + month : '' + month; // ('' + month) for string result
      } 

      const today = nowDate.getFullYear()+'-'+(getMonth(nowDate))+'-'+getDay(nowDate);

      let exercises = []
      let timing = []

      for (const element of days_exercise) {
        if(element["day"].split("-")[0]+"-"+element["day"].split("-")[1]+"-"+element["day"].split("-")[2].toString().substring(0,2)===dayCheck){
          if(element["repeats"]!=null){
            exercises.push(element["exerciseId"] + ", " + element["repeats"]+ " repeats")
            timing.push(element["day"].split("-")[2].toString().substring(3,8))
          } else {
            exercises.push(element["exerciseId"] + ", " + parseInt(element["time"]) + " seconds")
            timing.push(element["day"].split("-")[2].toString().substring(3,8))
          }
           
        }
    }

    console.log(exercises)
    console.log(timing)

    setTime(timing)
    setExercisesToday(exercises)
      

    } catch (error) {
      return<p>Error</p>;
    }
    ;
  }, [dayCheck, token]);


  const fetchMoviesHandler = useCallback(async () => {
    
    try {
      const response = await fetch(global.config.url + "stats/stats_calories/", {
      method: 'GET',
      headers: {
      Authorization: "Bearer " +token
      }
    });
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const temp = await response.json();
  
      

      const days = [...Array(temp.length)].map((_, index) => ({
        id: temp[index].id,
        day: temp[index].date,
        calories: temp[index].calories
      }));

      

      const nowDate = new Date(); 
      function getMonth(date) {
        var month = date.getMonth() + 1;
        return month < 10 ? '0' + month : '' + month; // ('' + month) for string result
      }  

      function getDay(date) {
        var month = date.getDate();
        return month < 10 ? '0' + month : '' + month; // ('' + month) for string result
      } 

      const today = nowDate.getFullYear()+'-'+(getMonth(nowDate))+'-'+getDay(nowDate);
      let pastDays = [];

      for (let i = 29; i >= 0; i--) {
        let now = new Date();
        let backdate = new Date(now.setDate(now.getDate() - i));
        let day = getDay(backdate)+'-'+ (getMonth(backdate));
        pastDays.push(day.toString())
      }

      let caloriesDays = [];
      let sum = 0

      function getDaysInMonth(year, month) {
        let date = new Date(year, month-1, 1);
        let days = [];
        while (date.getMonth() === month-1) {
          let day = getDay(date)+'-'+ (getMonth(date));
          days.push(day.toString())
          date.setDate(date.getDate() + 1);
        }
        return days;
      }



      for (let i = getDaysInMonth(year, month).length-1; i >= 0; i--) {
        let now = new Date();
        let flag = false
        let day = getDaysInMonth(year, month);
        for (let j = 0; j < days.length; j++) {
          if (day[i].toString()===days[j].day.split('-')[2].toString()+'-'+days[j].day.split('-')[1].toString()) {
            caloriesDays.push(days[j].calories.toFixed(2))
            flag=true
            break
          } 
        }
        if(!flag){
          caloriesDays.push(0)
        }
      }

      for (const element of caloriesDays) {
        sum+=parseInt(element)
    }


    

      setCaloriesDays(caloriesDays)
      let average = (sum/30).toFixed(2)
      setAvgCalories(average+ " kcal")


    

      setPastDays(getDaysInMonth(year, month))
      
      


      for (const element of days) {
        if(element["day"].toString()===today){
          if (element["calories"] < 1){
            setCaloriesToday(0.00+" kcal")
          }
          setCaloriesToday(element["calories"].toFixed(2).toString()+" kcal")
        }
    }
      

    } catch (error) {
      return<p>Error</p>;
    }
    ;
  }, [month, token, year]);

  useEffect(() => {
    fetchMoviesHandler();
    fetchExercises();
  }, [fetchMoviesHandler, fetchExercises]);

  function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', {
      month: 'long',
    });
  }

  let selectedMonth = toMonthName(month).toString()
  let title = "Average of calories burned in " + selectedMonth

  


  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Gymshare - train more effectively
        </Typography>

        <Grid container spacing={9}>
          <Grid item xs={12} sm={6} md={6}>
            <AppStatistics title="Calories burned today" total={caloriesToday} icon={'ant-design:pie-chart-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AppStatistics title={title} total={avgCalories} color="info" icon={'ant-design:fund-filled'} />
          </Grid>


          <Grid item xs={12} md={9} lg={12}>
            <AppWebsiteVisits
              title="Burned calories"
              subheader="Per day"
              chartLabels={pastDays}
              chartData={[
                {
                  name: 'Burned calories',
                  type: 'column',
                  fill: 'filled',
                  data: caloriesDays,
                },
              ]}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} lg={4} sx={{
    marginTop: 5,
  }}>
            <AppOrderTimeline
              title="Exercises performed"
              list={[...Array(exercisesToday.length)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: exercisesToday[index],
                type: `order${index + 1}`,
                time: time[index],
              }))}
            />
          </Grid>
      </Container>
    </Page>
  );
}
