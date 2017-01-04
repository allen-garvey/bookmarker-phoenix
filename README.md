# Bookmarker

## Getting Started

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Install Node.js dependencies with `npm install`
  * Install `gulp` if you have not already done so with `sudo npm install gulp -g`
  * Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:5051`](http://localhost:5051) from your browser.

## Run as daemon

  * Install forever.js if you haven't already with `npm install forever -g` (might require `sudo`)
  * Start the application with `forever --killSignal=SIGTERM start bookmarker.js` or with `./start.sh`
  * Stop the application with `forever stop bookmarker.js`