// This is where I will do k6 stress testing
import http from 'k6/http';

export default function test () {
  http.get('http://localhost:8080/reviews?product_id=1000011')
  // http.get('http://localhost:8080/reviews/meta?product_id=1000011')
}

// k6 run --vus 10 --iterations 10 /Users/sullyclark/Desktop/HackReactor/SDC/RFP-2204-FEC/server/reviews_sully/stress-testing.js