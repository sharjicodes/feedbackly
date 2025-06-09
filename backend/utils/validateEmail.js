// utils/validateEmail.js
import axios from 'axios';

export const isValidEmail = async (email) => {
  try {
    const access_key = process.env.MAILBOXLAYER_API_KEY;

    const response = await axios.get('https://apilayer.net/api/check', {
      params: {
        access_key,
        email,
        smtp: 1,
        format: 1,
      },
    });

    const data = response.data;

    return data.format_valid && data.smtp_check;
  } catch (error) {
    console.error('Mailboxlayer API error:', error.message);
    return false;
  }
};
