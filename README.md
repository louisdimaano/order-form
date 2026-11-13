# Dimporium Order Form

An order form for Dimporium, my small 3D printing side project. Customers fill out what they want printed, attach a sketch or photo if they have one, and send the order to me straight from their phone's share menu.

**Live site:** https://louisdimaano.github.io/order-form/

## Features

- Order details, color and material choices, custom text, and an optional deadline
- Required fields are checked before the form can be submitted
- Customers can attach sketches or photos from their camera or gallery
- Builds an order summary that skips any questions left blank and trims extra spaces
- Send button opens the phone's share menu with the summary and photos already attached
- Copy button as a backup for devices that can't share
- Works on phones (fields stack on small screens)
- Light and dark mode based on the device's settings

## Privacy

Nothing a customer enters is saved or uploaded by the page. Everything runs in the browser on their device, and their order and photos only leave their phone when they tap Send and choose how to send it.

## Colors in Stock Page

- colors.html reads colors.json and shows a card for each color, grouped by material and finish (for example PLA, PLA · Matte). Each card shows the real color, including dual color, tri color, gradient, and translucent filament, plus a stock level:

- Plenty: enough for most prints
- Limited: fine for small prints, big prints may need a new spool
- Low: ask me first

colors.json comes from SpoolManager, the filament tracker I run on my home server. A script there pushes a new copy to this repo whenever my stock changes, so the page stays up to date without me editing it.

## Built With

- HTML
- CSS (custom properties, CSS Grid, media queries)
- JavaScript (no frameworks or libraries)
- Web Share API and Clipboard API
- Fetch API to load the color list from a JSON file
- Hosted on GitHub Pages

## What I Learned

This was my first project built with HTML, CSS, and JavaScript from scratch. Some of the things I learned:

- How HTML elements nest inside each other, and how one missing closing tag can shift everything after it
- Using CSS variables so the whole color scheme, including dark mode, can be changed in one place
- Making a layout respond to screen size with CSS Grid and media queries
- Reading form data with JavaScript and building output from it
- Testing edge cases, like submitting with only the required fields filled in
- Reading error messages in the browser console to track down bugs
- How adding a new feature can break old code (adding photo uploads broke the step that trimmed spaces from answers)
- Checking that a browser supports a feature before using it, and giving a backup option when it doesn't
- Testing on real devices: Outlook on Windows needed a different kind of line break, and Gmail on Android removed line breaks completely
- Using Git to save my progress, pulling changes before pushing, and fixing a merge conflict
- Loading a JSON file with fetch and building the page from it, and why that only works through a web server, not by opening the file directly
- Putting data on the page with textContent instead of innerHTML, so text from a file can never run as code
- Using the CSS + selector to style one element based on what comes right before it
- Tracking down a 404 error caused by a file named color.js instead of colors.js

## Running It Locally

1. Clone or download this repository
2. In the project folder, run python -m http.server
3. Open http://localhost:8000

No installs or build steps needed. The color page needs a local server because browsers block fetch on files opened directly from your computer. The Send button may also need the live site, since some browsers only allow sharing on secure (https) pages.

## Future Improvements

- Send orders straight to my email when the customer taps Submit, without them having to pick an app or type my address
- Turn the color field into a dropdown of filament colors I have in stock
- Keep the summary easy to read in email apps that remove line breaks
