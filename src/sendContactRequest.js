import axios from 'axios';

export default function send({
                               topic,
                               name,
                               message,
                               email,
                               agree,
                               file,
                               recaptchaToken,
                             }) {
  const data = new FormData();
  data.append('topic', topic);
  data.append('name', name);
  data.append('message', message);
  data.append('email', email);
  data.append('agree', agree);
  data.append('recaptchaToken', recaptchaToken);
  if (file) {
    data.append('file', file);
  }
  return axios.post('/api/contact', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
