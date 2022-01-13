import React, { Fragment, useState } from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

function KeyboardDatePickerExample(props) {
  const [selectedDate, setDate] = useState(moment()); //here i declare selectedDate using useState Hook and create setDate function which lets me update the selectedDate
  const [inputValue, setInputValue] = useState(moment().format('YYYY-MM-DD'));

  const onDateChange = (date, value) => {
    setDate(date);
    setInputValue(value);
    props.onChange(value);
    console.log(value);
  };

  const dateFormatter = str => {
    return str;
  };

  return (
    <Fragment>
      <MuiPickersUtilsProvider
        libInstance={moment}
        utils={MomentUtils}
        showtodaybutton={true}
      >
        <KeyboardDatePicker
          autoOk={true}
          value={selectedDate}
          format='YYYY-MM-DD'
          inputValue={inputValue}
          onChange={onDateChange}
          rifmFormatter={dateFormatter}
          minDate={moment()}
          maxDate={moment().add(7, 'days')}
          disableFuture={false}
          inputVariant='outlined'
          variant='inline'
          margin='normal'
        />
      </MuiPickersUtilsProvider>
    </Fragment>
  );
}

export default KeyboardDatePickerExample;