(function () {
  'use strict';

  var form = document.getElementById('logout-form');
  if (!form || typeof fetch !== 'function') return;

  fetch('/api/auth-status', { cache: 'no-store', credentials: 'same-origin' })
    .then(function (response) {
      if (!response.ok) throw new Error('auth-status');
      return response.json();
    })
    .then(function (status) {
      form.hidden = !(status && status.enabled && status.authenticated);
    })
    .catch(function () {
      form.hidden = true;
    });
})();
