import axios from 'axios';

import { updateTicketSearchFailed } from '../models/tickets';

export const username = process.env.USERNAME;
export const password = process.env.PASSWORD;
export const login = async (sponsorID: number, cookies: string, id: number) => {
  try {
    const promise = await axios({
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies,
      },

      method: 'post',
      url: 'https://bergencountyrba.ezlinksgolf.com/api/login/login',
      data: {
        Login: username,
        MasterSponsorID: `${sponsorID}`,
        Password: password,
        SessionID: '',
      },
    });
    return promise;
  } catch (err) {
    updateTicketSearchFailed(id, err, 'login Request');
  }
};
