import axios from 'axios';
import { updateTicketSearchFailed } from '../models/tickets';

export const getAllItems = async (cookies: string, id: number) => {
  try {
    const promise = await axios({
      headers: {
        Cookie: cookies,
      },

      method: 'get',
      url: 'https://bergencountyrba.ezlinksgolf.com/api/cart/getallitems',
    });
    return promise;
  } catch (err) {
    updateTicketSearchFailed(id, err, 'getAllItems Request');
  }
};
