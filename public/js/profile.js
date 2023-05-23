const editFormHandler = async (event) => {
  event.preventDefault();

  const username = document.getElementById('edit-username').value;
  const organization = document.getElementById('edit-organization').value;
  const organization_url = document.getElementById('edit-organization-url').value;
  const email = document.getElementById('edit-email').value;
  const password = document.getElementById('edit-password').value;

  const formData = {};

  if (username) {
    formData.username = username;
  }
  if (organization) {
    formData.organization = organization;
  }
  if (organization_url) {
    formData.organization_url = organization_url;
  }
  if (email) {
    formData.email = email;
  }
  if (password) {
    formData.password = password;
  }

  const response = await fetch('/api/user', {
    method: 'PUT',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    alert("Your profile has been updated!");
    document.location.replace('/profile');
  } else {
    alert('Failed to update profile');
  }
};

const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#event-name').value.trim();
  const description = document.querySelector('#event-desc').value.trim();
  const event_date = document.querySelector('#event-date').value.trim();

  if (name && description && event_date) {
    const response = await fetch(`/api/event`, {
      method: 'POST',
      body: JSON.stringify({ name, description, event_date }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert("Ayyyy event created");
      document.location.replace('/profile');
    } else {
      alert('Failed to create event');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const event_id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/event/${event_id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Event deleted successfully');
      document.location.replace('/profile');
    } else {
      alert('Failed to delete event');
    }
  }
};



document.querySelector('.Edit-form').addEventListener('submit', editFormHandler);

const newEventForm = document.querySelector('.new-event-form');
if (newEventForm) {
  newEventForm.addEventListener('submit', newFormHandler);
}

const eventList = document.querySelector('.event-list');
if (eventList) {
  eventList.addEventListener('click', (event) => {
    if (event.target.classList.contains('unsubscribe-button') || event.target.classList.contains('btn-danger')) {
      delButtonHandler(event);
    }
  });
}