'use strict';
const apiKey = 'rJabroEopDcRurpMWTPrfCaK8SkB8A8aWmCXq2Om';

const baseUrl = 'https://developer.nps.gov/api/v1/parks';

//join params in to a sting
function formatQueryParams(params) {
  console.log(Object.keys(params));
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayResults(responseJson, maxResults) {
//remove previous result
  $('.results').empty();
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; i < responseJson.data.length & i<maxResults ; i++){
    //add a list item to the results with the full name, description, and website url
    $('.results').append(
      `<li><a href="${responseJson.data[i].url}"><h3>${responseJson.data[i].fullName}</h3></a>
      <p>${responseJson.data[i].description}</p>
      <p>${responseJson.data[i].addresses}</p>
      </li>`);
  }
}

function getParks(query, maxResults=10, arr) {
 
  const params = {
    stateCode: arr,
    q: query,
  };

  const queryString = formatQueryParams(params);
  //get url to fetch
  const url = baseUrl + '?' + queryString;
  console.log(url);
  
  const options = {
    headers: new Headers({
      'X-Api-Key': apiKey})
  };
  
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
    
}



function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#input').val();
    const maxResults = $('#max-results').val();
    const stateArray = $('#select-state').val();
    getParks(searchTerm, maxResults, stateArray);
  });
}

$(watchForm);