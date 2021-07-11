import axios from 'axios';
import { ReservationRequest } from '../types/reserve';
import { updateTicketSearchFailed } from '../models/tickets';

export const reservation = async (
  body: ReservationRequest,
  cookies: string,
  id: number
) => {
  try {
    const promise = await axios({
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies,
      },
      method: 'post',
      url: 'https://bergencountyrba.ezlinksgolf.com/api/search/reservation',
      data: body,
    });
    return promise;
  } catch (err) {
    updateTicketSearchFailed(id, err, 'reservation Request');
  }
};

export const createReserveOBJ: (r: any) => ReserveRequest = (response: any) => {
  let d = response.data;
  let match = d.r06[0];
  let body: ReservationRequest = {
    p02: [
      {
        r01: match.r06, //r06
        r02: match.r05, //r05
        r03: match.r13, //r13
        r04: match.r03, //r03
        r05: match.r03, //r03
        r06: match.r02.toFixed(0), //r02 (fixed(0)?)
        r07: match.r20, //r20
      },
    ],
    p01: match.r01, //r01
    p03: d.r02, // in root r02
  };
  let cookies: string = response.headers['set-cookie'][0].split(';')[0];
  console.log({ body, cookies });

  return { body, cookies };
};

export interface ReserveRequest {
  body: ReservationRequest;
  cookies: string;
}
