// Base URL for fetching currency exchange rates in JSON format
const BASE_URL = "https://2024-03-06.currency-api.pages.dev/v1/currencies/";

// Select all dropdowns inside elements with class "dropdown"
const dropdowns = document.querySelectorAll(".dropdown select");

// Select the button inside the form
const btn = document.querySelector("form button");

// Select the "from" currency dropdown
const fromCurr = document.querySelector(".from select");

// Select the "to" currency dropdown
const toCurr = document.querySelector(".to select");

// Select the element where the message/result will be shown
const msg = document.querySelector(".msg");

// Loop through both "from" and "to" dropdowns
for (let select of dropdowns) {
  // Loop through all currency codes in countryList (assumed global object)
  for (currCode in countryList) {
    // Create a new <option> element for each currency
    let newOption = document.createElement("option");
    newOption.innerText = currCode; // Show the currency code (e.g. USD, INR)
    newOption.value = currCode; // Set the value for the option

    // Set default selected option in "from" dropdown as USD
    if (select.name === "from" && currCode === "USD") {                                               
      newOption.selected = "selected";
    // Set default selected option in "to" dropdown as INR
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    // Add the option to the current dropdown
    select.append(newOption);
  }

  // When dropdown value changes, update the flag image
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to fetch exchange rate and update the message
const updateExchangeRate = async () => {
  // Get the input element for amount
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  // If input is empty or less than 1, default to 1
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Create the API URL based on selected "from" currency
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

  // Fetch the currency data from the API
  let response = await fetch(URL);
  let data = await response.json();

  // Get the exchange rate to the selected "to" currency
  let rate = data[toCurr.value.toLowerCase()];

  // Calculate final amount after conversion
  let finalAmount = (data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()] * parseInt(amount.value)).toFixed(2);

  // Show the conversion result in the message area
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
};

// Function to update the flag next to dropdown based on selected currency
const updateFlag = (element) => {
  let currCode = element.value; // Get selected currency code
  let countryCode = countryList[currCode]; // Get country code from countryList
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`; // Create flag image URL
  let img = element.parentElement.querySelector("img"); // Find the img element in the dropdown
  img.src = newSrc; // Set the new flag image
};

// Add click event to the button to update exchange rate
btn.addEventListener("click", (evt) => {
  evt.preventDefault(); // Prevent form from submitting/reloading
  updateExchangeRate(); // Call function to update exchange rate
});

// Automatically update exchange rate when page loads
window.addEventListener("load", () => {
  updateExchangeRate();
});
