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
