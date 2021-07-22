import axios from 'axios';

import { updateTicketSearchFailed } from '../models/tickets';

export const login = async (
  sponsorID: number,
  cookies: string,
  id: number,
  golferUsername: string,
  golferPassword: string
) => {
  try {
    const promise = await axios({
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies,
      },

      method: 'post',
      url: 'https://bergencountyrba.ezlinksgolf.com/api/login/login',
      data: {
        Login: golferUsername,
        MasterSponsorID: `${sponsorID}`,
        Password: golferPassword,
        SessionID: '',
      },
    });
    return promise;
  } catch (err) {
    updateTicketSearchFailed(id, err, 'login Request');
  }
};
