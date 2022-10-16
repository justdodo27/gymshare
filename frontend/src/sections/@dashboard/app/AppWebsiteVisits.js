import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, Button } from '@mui/material';
// components
import { BaseOptionChart } from '../../../components/chart';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Grid from '@mui/material/Grid'
import { useDispatch} from 'react-redux';
import { monthActions } from 'src/store/month';
import { MonitorHeartRounded } from '@mui/icons-material';
import { useEffect } from 'react';

export let month = 0
// ----------------------------------------------------------------------

AppWebsiteVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};



export default function AppWebsiteVisits({ title, subheader, chartLabels, chartData, ...other }) {

  const dispatch = useDispatch();
  const chartOptions = merge(BaseOptionChart(), {
    plotOptions: { bar: { columnWidth: '16%' } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: chartLabels,
    xaxis: { type: 'number' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)}`;
          }
          return y;
        },
      },
    },
  });

  const d = new Date();
  let month = d.getMonth()+1;
  useEffect(() => {
    dispatch(monthActions.selected(month));
  }, []);


  const handleCreateNewItem = (e) => {
    e.preventDefault();
    dispatch(monthActions.selected(e.target.value))
  };

  return (
    <Card {...other}>
      
      <CardHeader title={title} subheader={subheader}/>
      
      <Grid container justifyContent="flex-end" paddingRight={10}>
      <FormControl> 
        <NativeSelect
          defaultValue={month}
          onChange={handleCreateNewItem}
          inputProps={{
            name: 'month',
            id: 'uncontrolled-native',
          }}
        >
          <option value={1}>January</option>
          <option value={2}>February</option>
          <option value={3}>March</option>
          <option value={4}>April</option>
          <option value={5}>May</option>
          <option value={6}>June</option>
          <option value={7}>July</option>
          <option value={8}>August</option>
          <option value={9}>September</option>
          <option value={10}>October</option>
          <option value={11}>November</option>
          <option value={12}>December</option>
        </NativeSelect>
      </FormControl>
      </Grid>
   

      <Box sx={{ p: 3, pb: 1 }} dir="ltr" margin={0}>
        <ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
