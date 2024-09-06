import $ from 'jquery-slim';

$(document).ready(() => {
    console.log('jQuery is working!');
    console.log('Current Environment:', process.env.NODE_ENV);
    console.log('API URL:', process.env.URL);
});
