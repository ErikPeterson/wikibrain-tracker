WikiBrain Tracker
=================

WBT is a component of WikiBrain, a project to map personal knowledge based on browsing habits. The Tracker is a Chrome extension that records the user's visits to Wikipedia pages, along with relevant metadata, for reporting to the WikiBrain application server.

Each time the user visits a Wikipedia page, the visit is documented by the extension. When the user takes action to leave the page, this data is recorded to Chrome's synced storage in a queue. The next time the user visits a Wikipedia page, the extension will attempt to send all documents in the queue to the WikiBrain application server.

The extension maintains credentials for the user to access the WikiBrain API. These credentials can be managed from the extension options dialog on `chrome://extensions`.

## Data Format

Currently, the tracker records a payload in the following format for each page that is visited, each time that it is visited:

```json

{
  "permalink": "https://en.wikipedia.org/w/index.php?title=Staples_Center&oldid=715766449",
  "location": {
    "hash": "",
    "search": "",
    "pathname": "/wiki/Staples_Center",
    "port": "",
    "hostname": "en.wikipedia.org",
    "host": "en.wikipedia.org",
    "protocol": "https:",
    "origin": "https://en.wikipedia.org",
    "href": "https://en.wikipedia.org/wiki/Staples_Center",
    "ancestorOrigins": {}
  },
  "openedAt": 1463297273404,
  "leftAt": 1463297505213,
  "blurs": [
    1463297273540,
    1463297328342,
    1463297497408
  ],
  "focuses": [
    1463297327410,
    1463297485982,
    1463297503618
  ]
}
````

The `permalink` is the archival link provided by Wikipedia for the entry's current state.

The `location` hash represents the URL that the user actually used to reach the entry.

The `openedAt` property is a UTC timestamp indicating when the user landed on the page for this visit.

The `leftAt` property is a UTC timestamp indicating when the user took an action to leave the page.

`blurs` and `focuses` record each time the user left or returned to the page while it was open as a UTC timestamp.

## Todo

- Add device metrics to data
- Add window size change metrics to data
- Add scrolling metrics to data
- Refactor to send actual current markup, CSS, and JS to WikiBrain