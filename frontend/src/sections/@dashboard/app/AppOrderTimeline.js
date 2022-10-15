// @mui
import PropTypes from 'prop-types';
import { Card, Typography, CardHeader, CardContent } from '@mui/material';
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector } from '@mui/lab';
// utils
import { fDateTime } from '../../../utils/formatTime';
import * as React from 'react';

import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/material';
import { useDispatch} from 'react-redux';
import { dayActions } from 'src/store/day';
// ----------------------------------------------------------------------


const materialTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

AppOrderTimeline.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppOrderTimeline({ title, subheader, list, ...other }) {

  const dispatch = useDispatch();
  const nowDate = new Date(); 

  function getMonth(date) {
    return date < 10 ? '0' + date : '' + date; // ('' + month) for string result
  }  

  function getDay(date) {
    return date < 10 ? '0' + date : '' + date; // ('' + month) for string result
  } 

  const today = nowDate.getFullYear()+'-'+(getMonth(nowDate))+'-'+getDay(nowDate);

  const [value, setValue] = React.useState(dayjs());

  let date = value.get('year')+"-"+getMonth(parseInt(value.get('month')+1))+"-"+getDay(parseInt(value.get('date')))
  
  dispatch(dayActions.selected(date))

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{
    marginBottom: 2,
  }}/>

<ThemeProvider theme={materialTheme}> 
      <LocalizationProvider dateAdapter={AdapterDayjs} >
      <DatePicker
        label="Choose day"
        value={value}
        minDate={dayjs('2019-01-01')}
        maxDate={dayjs('2023-01-01')}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => <TextField {...params} sx={{
              svg: { color: '#fff' },
              input: { color: '#fff' },
              label: { color: '#fff' },
              marginLeft: 2
            }}/>}
      />
    </LocalizationProvider>
    </ThemeProvider>

      <CardContent
        sx={{
          '& .MuiTimelineItem-missingOppositeContent:before': {
            display: 'none',
          },
        }}
      >
        <Timeline>
          {list.map((item, index) => (
            <OrderItem key={item.id} item={item} isLast={index === list.length - 1} />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  isLast: PropTypes.bool,
  item: PropTypes.shape({
    time: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
  }),
};

function OrderItem({ item, isLast }) {
  const { type, title, time } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (type === 'order1' && 'primary') ||
            (type === 'order2' && 'success') ||
            (type === 'order3' && 'info') ||
            (type === 'order4' && 'warning') ||
            'error'
          }
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {time}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
