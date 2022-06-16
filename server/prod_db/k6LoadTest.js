import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '30s',
};

export default function () {
  http.get('http://localhost:8080/products/1/styles');
  sleep(1);
}
