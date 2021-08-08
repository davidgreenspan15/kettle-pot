import axios from 'axios';

import { updateTicketSearchFailed } from '../models/tickets';

export const initializeSenior = async (id: number, cookie: string) => {
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
      url: 'https://bergencountyrbs.ezlinksgolf.com/api/search/gsahs',
      data: { sponsorId: 17704 },
    });

    return promise;
  } catch (err) {
    console.log(err, 'failed here');
    updateTicketSearchFailed(id, err, 'search Request');
  }
};
