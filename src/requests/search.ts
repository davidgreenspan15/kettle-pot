import axios from 'axios';
import { SearchRequest } from '../types/search';
export const search = (body: SearchRequest) => {
  const promise = axios({
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    url: 'https://bergencountyrba.ezlinksgolf.com/api/search/search',
    data: body,
  });

  const response = promise.then(response => response);

  return { response };
};
