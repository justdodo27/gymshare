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
} from '../sections/@dashboard/app';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useSelector} from 'react-redux';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();
  let token = useSelector(state => state.auth.token);
  const [caloriesToday, setCaloriesToday] = useState('')
  const [pastDays, setPastDays] = useState([])
  const [caloriesDays, setCaloriesDays] = useState([])
  const [avgCalories, setAvgCalories] = useState("")

  const fetchMoviesHandler = useCallback(async () => {
    
    try {
      const response = await fetch("http://localhost:1337/stats/stats_calories/", {
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

      for (let i = 29; i >= 0; i--) {
        let now = new Date();
        let flag = false
        let backdate = new Date(now.setDate(now.getDate() - i));
        let day = backdate.getFullYear()+'-'+(getMonth(backdate))+'-'+getDay(backdate);
        for (let j = 0; j < days.length; j++) {
          if (day.toString()===days[j].day.toString()) {
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

    

      setPastDays(pastDays)
      
      


      for (const element of days) {
        if(element["day"].toString()===today){
          setCaloriesToday(element["calories"].toString()+" kcal")
        }
    }
      

    } catch (error) {
      return<p>Error</p>;
    }
    ;
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  
  console.log(pastDays)


  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Gymshare - train more effectively
        </Typography>

        <Grid container spacing={9}>
          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary title="Calories burned today" total={caloriesToday} icon={'ant-design:pie-chart-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary title="Average of calories burned in the last month" total={avgCalories} color="info" icon={'ant-design:fund-filled'} />
          </Grid>

          <Grid item xs={12} md={9} lg={12}>
            <AppWebsiteVisits
              title="Burned calories"
              subheader="Past month"
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
      </Container>
    </Page>
  );
}
