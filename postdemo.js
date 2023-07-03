import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';

export let options = {
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete within 500ms
    'http_req_duration{type:post}': ['avg<200'], // Average response time for POST requests should be less than 200ms
    'http_req_duration{type:post, status:200}': ['avg<150'], // Average response time for successful POST requests should be less than 150ms
    http_req_failed: ['rate<0.1'], // Error rate should be less than 10%
  },
};

export default function () {
  const payload = JSON.stringify({
    name: 'morpheus',
    job: 'leader',
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  const response = http.post('https://reqres.in/api/users', payload, { headers });

  // Check the response status code
  check(response, {
    'Status is 200': (r) => r.status === 200,
  });

  // Check the response time
  check(response, {
    'Response time is less than 500ms': (r) => r.timings.duration < 500,
  });

  // Print the response status code and response time
  console.log('Status Code:', response.status);
  console.log('Response Time (ms):', response.timings.duration);

  sleep(1);
}
