fetch('./perks.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.table(data);
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });
  