import axios from 'axios';

export const isValidEmail = async (email) => {
  const accessKey = process.env.MAILBOXLAYER_API_KEY;
  const url = `https://apilayer.net/api/check?access_key=${accessKey}&email=${email}&smtp=1&format=1`;

  try {
    const { data } = await axios.get(url);

    // You can fine-tune these checks
    return data.format_valid && data.smtp_check;
  } catch (err) {
    console.error('Email validation failed:', err.message);
    return false;
  }
};
