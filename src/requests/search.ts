import axios from 'axios';
import moment from 'moment';

import { updateTicketSearchFailed } from '../models/tickets';
import { SearchForm, SearchRequest } from '../types/search';

export const search = async (
  body: SearchRequest,
  id: number,
  cookie?: string
) => {
  let headers = {
    'Content-Type': 'application/json',
  };
  if (cookie) {
    let cookies: string = cookie['set-cookie'][0].split(';')[0];
    headers['Cookie'] = cookies;
  }
  try {
    const promise = await axios({
      headers: headers,
      method: 'post',
      url: 'https://bergencountyrba.ezlinksgolf.com/api/search/search',
      data: body,
    });

    return promise;
  } catch (err) {
    console.log(err, 'failed here');
    updateTicketSearchFailed(id, err, 'search Request');
  }
};

const convertTime = (time: string) => {
  let startT = time.split(':');
  let startS = '';
  if (parseInt(startT[0]) > 12) {
    startT[0] = (parseInt(startT[0]) - 12).toString();
    startS = startT.join(':') + ' PM';
  } else if (parseInt(startT[0]) === 12) {
    startS = startT.join(':') + ' PM';
  } else {
    if (startT[0][0] === '0') {
      startT[0] = startT[0].substring(1);
    }
    startS = startT.join(':') + ' AM';
  }
  return startS;
};
export const createSearchOBJ = (body: SearchForm) => {
  let start = convertTime(body.startTime);
  let end = convertTime(body.endTime);

  let obj: SearchRequest = {
    p01: body.courses, // courses
    p02: moment(body.date).format('MM/DD/YYYY'), // date format(MM/DD/YYY)
    p03: start, // start time formaat("H:MM S")
    p04: end, // end time formaat("H:MM S")
    p05: 0, // min players 0
    p06: body.max, // max players up to 4
    p07: false, //false
  };

  return obj;
};

export interface Option {
  label: string;
  value: number;
}
