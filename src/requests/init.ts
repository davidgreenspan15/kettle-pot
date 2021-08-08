import axios from 'axios';

export const init = async () => {
  try {
    const promise = await axios({
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'get',
      url: 'https://bergencountyrbs.ezlinksgolf.com/api/search/init',
    });

    return promise;
  } catch (err) {
    console.log(err, 'failed here');
  }
};
