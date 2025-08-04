/** Update this accordingly
 *    index.html is not modified. All elements are generated via JS.
 *    The application updates state by fetching an array of parties from the API.
 *    The application renders a list of party names.
 *    When a party name is clicked on, the application updates state by fetching information about a single party from the API.
 *    The application renders the name, ID, date, description, and location of the selected party.
 *    The application renders a message telling users to select a party if none is selected.
 *    Functions are used to organize logic involving state changes.
 *    The application is rerendered whenever state changes.
 *    UI elements are organized into component functions.
 *    All thrown errors are explicitly caught with a try...catch statement.
 */

// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2507-nvila"; // Make sure to change this!
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;
console.log(API);

// === State ===
let events = [];
let selectedEvent;

/** Updates 'events' with all events from the API */
const getEvents = async () => {
  try {
    const response = await fetch(API);
    const info = await response.json();
    events = info.data;
  } catch (error) {
    console.log(error);
  }
};

/** Updates 'selectedEvent' with a single event from the API */
const getEvent = async (id) => {
  try {
    const response = await fetch(API + "/" + id);
    const info = await response.json();
    selectedEvent = info.data;
    render();
  } catch (error) {
    console.log(error);
  }
};

// === Components ===
/** Event name that shows more details about the event when clicked */
const eventListItem = (event) => {
  // stuff each event name inside a list item
  // link the event name to an event that provides more details on that specific event
  const $li = document.createElement("li");
  const $a = document.createElement("a");

  $a.href = "#selected";
  $a.textContent = event.name;
  $a.addEventListener("click", function () {
    getEvent(event.id);
  });

  $li.append($a);
  return $li;
};

/** A list of names of all events */
const eventList = () => {
  // this is where we have to store all the eventListItems
  const $ul = document.createElement("ul");
  $ul.classList.add("lineup");

  for (let event of events) {
    let eventName = eventListItem(event);
    $ul.append(eventName);
  }
  return $ul;
};

/** Detailed information about the selected artist */
const eventDetails = () => {
  if (!selectedEvent) {
    const $p = document.createElement("p");
    $p.textContent =
      "Please select an event for more details. Hope to see you soon!";
    return $p;
  }

  const $figure = document.createElement("figure");
  const $h3 = document.createElement("h3");
  $h3.textContent = `${selectedEvent.name} #${selectedEvent.id}`;

  const $p1 = document.createElement("p");
  $p1.innerHTML = `<strong>Date:</strong> ${selectedEvent.date.slice(
    0,
    10
  )} <br> <strong>Time:</strong> ${selectedEvent.date.slice(11, 16)}`;
  $p1.id = "timeDate";

  const $p2 = document.createElement("p");
  $p2.textContent = selectedEvent.description;
  $p2.id = "desc";

  $figure.append($h3);
  $figure.append($p1);
  $figure.append($p2);
  return $figure;
};

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Event Planner</h1>
    <main>
      <section>
        <h2>Upcoming Events</h2>
        <EventList></EventList>
      </section>
      <section id="selected">
        <h2>Event Details</h2>
        <EventDetails></EventDetails>
      </section>
    </main>
  `;
  $app.querySelector("EventList").replaceWith(eventList());
  $app.querySelector("EventDetails").replaceWith(eventDetails());

  console.log(events);
}

async function init() {
  await getEvents();
  render();
}

init();
