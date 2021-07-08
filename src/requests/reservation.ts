import axios from 'axios';
import { ReservationRequest } from '../types/reserve';
export const reservation = (body: ReservationRequest, cookies: string) => {
  // create a promise for the axios request
  const promise = axios({
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookies,
    },
    method: 'post',
    url: 'https://bergencountyrba.ezlinksgolf.com/api/search/reservation',
    data: body,
  });

  const response = promise.then(response => response);

  // return it
  return { response };
};
