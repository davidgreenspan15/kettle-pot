import axios from 'axios';

export const getAllItems = async (cookies: string) => {
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
    console.log(err);
  }
};
