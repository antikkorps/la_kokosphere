const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // On accepte uniquement les requêtes POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return { statusCode: 400, body: 'Email is required' };
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_LIST_ID = process.env.BREVO_LIST_ID; // L'ID de la liste de contacts Brevo

    if (!BREVO_API_KEY || !BREVO_LIST_ID) {
      return { statusCode: 500, body: 'API key or List ID is not configured.' };
    }

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email,
        listIds: [parseInt(BREVO_LIST_ID, 10)],
        updateEnabled: true // Met à jour le contact s'il existe déjà
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API Error:', errorData);
      return { statusCode: response.status, body: JSON.stringify(errorData) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully subscribed!' }),
    };

  } catch (error) {
    console.error('Subscription Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error occurred during subscription.' }),
    };
  }
};
