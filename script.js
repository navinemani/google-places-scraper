import axios from 'axios'
import csvWriter from 'csv-writer'

// Put your API key here
const googleApiKey = ""

const fetchPlaceId = async (address) => {
  const autoCompleteURL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?"

  const params = {
    params: {
      input:      address,
      components: "country:ca",
      key:        googleApiKey
    }
  }

  const response = await axios.get(autoCompleteURL, params)
  return response.data.predictions[0].place_id
}

const fetchLocation = async (placeId) => {
  const detailsURL = "https://maps.googleapis.com/maps/api/place/details/json?"

  const params = {
    params: {
      place_id: placeId,
      key:      googleApiKey
    }
  }

  const response = await axios.get(detailsURL, params)
  const location = response.data.result.geometry.location
  return { latitude: location.lat, longitude: location.lng }
}

const findClosestDentists = async (latitude, longitude) => {
  const nearbySearchURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"

  const params = {
    params: {
      location: `${latitude},${longitude}`,
      radius:   5000,
      type:     'dentist',
      key:      googleApiKey
    }
  }

  const response = await axios.get(nearbySearchURL, params)
  return response.data.results
}

const writer = () => {
  return csvWriter.createObjectCsvWriter({
    path: 'out.csv',
    header: [
      {id: 'name', title: 'Name'},
      {id: 'place_id', title: 'Place ID'},
      {id: 'age', title: 'Age'},
      {id: 'gender', title: 'Gender'},
    ]
  });
}

const placeId                 = await fetchPlaceId('5 Yonge Street')
const { latitude, longitude } = await fetchLocation(placeId)
const dentists                = await findClosestDentists(latitude, longitude)
  
console.log(dentists)

const data = [
  {
    name: 'John',
    surname: 'Snow',
    age: 26,
    gender: 'M'
  }, {
    name: 'Clair',
    surname: 'White',
    age: 33,
    gender: 'F',
  }, {
    name: 'Fancy',
    surname: 'Brown',
    age: 78,
    gender: 'F'
  }
];

writer
  .writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));


