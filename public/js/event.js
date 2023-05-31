const subscribeButtonHandler = async (event) => {
  event.preventDefault();

  if (event.target.hasAttribute('data-id')) {
    const event_id = event.target.getAttribute('data-id');

    try {
      const response = await fetch(`/api/event/${event_id}`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Subscribed to event successfully');
        document.location.reload();
      } else {
        alert('Failed to subscribe to event');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while subscribing to event');
    }
  }
};
if(document.querySelector('.btn-dark')){
document.querySelector('.btn-dark').addEventListener('click', subscribeButtonHandler);
}

const newCommentFormHandler = async (event) => {
  event.preventDefault();

  const comment = document.querySelector('#comment').value.trim();
  const event_id = event.target.getAttribute('data-event-id');
  if (comment) {
    const response = await fetch(`/api/comment/${event_id}`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert('Failed to create comment');
    }
  }
};

document
  .querySelector('.new-comment-form')
  .addEventListener('submit', newCommentFormHandler);