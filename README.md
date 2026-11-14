# Dimporium Order Form

An order form for Dimporium, my small 3D printing side project. Customers fill out what they want printed, attach a sketch or photo if they have one, and send the order to me straight from their phone's share menu.

**Live site:** https://louisdimaano.github.io/order-form/

## Features

- Name and contact fields, so every order says who it's from
- Pick a material first, then choose from the colors I have in stock in that material, grouped by finish (Basic, Matte, Silk, and more)
- A [colors in stock](https://louisdimaano.github.io/order-form/colors.html) page that shows each filament color and how much I have
- Custom text fields that only appear when emboss or deboss is picked
- Quantity takes whole numbers only, and the deadline date only appears when "I need it by a certain date" is checked (past dates are blocked)
- Answers are saved as a draft on the customer's device, so they can leave and finish later
- Customers can attach sketches or photos from their camera or gallery, with thumbnails to check they picked the right ones
- Builds an order summary that skips any questions left blank and trims extra spaces, shown as a printed order ticket
- Send button opens the phone's share menu with the summary and photos already attached
- Copy button as a backup for devices that can't share
- Link preview card, tab icon, and home screen icon, so the link looks like Dimporium when it's texted or shared
- Works on phones (fields stack on small screens)
- Light and dark mode based on the device's settings

## Privacy

Nothing a customer enters is uploaded by the page. Their answers (not photos) are saved as a draft in their own browser on their own device, and the draft is cleared once they send the order or start a new one. Their order and photos only leave their phone when they tap Send and choose how to send it.

## Colors in Stock Page

`colors.html` reads `colors.json` and shows a card for each color, grouped by material and finish (for example PLA, PLA · Matte). Each card shows the real color, including dual color, tri color, gradient, and translucent filament, plus a stock level:

- **Plenty:** enough for most prints
- **Limited:** fine for small prints, big prints may need a new spool
- **Low:** ask me first

The order form uses the same file to fill its color lists.

`colors.json` comes from [SpoolManager](https://github.com/louisdimaano/spool-manager), the filament tracker I run on my home server. A script there pushes a new copy to this repo whenever my stock changes, so the page and the form stay up to date without me editing them.

## Built With

- HTML
- CSS (custom properties, CSS Grid, Flexbox, media queries, masks, and keyframe animations)
- JavaScript (no frameworks or libraries)
- Web Share API and Clipboard API
- Fetch API to load the color list from a JSON file
- localStorage for saved drafts
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
- Loading a JSON file with `fetch` and building the page from it, and why that only works through a web server, not by opening the file directly
- Putting data on the page with `textContent` instead of `innerHTML`, so text from a file can never run as code
- Using the CSS `+` selector to style one element based on what comes right before it
- Tracking down a 404 error caused by a file named `color.js` instead of `colors.js`
- Building dropdown options with JavaScript, and why values have to match exactly (`petg` is not `PETG`)
- Showing and hiding fields based on other answers, and only making a field required while it's visible
- Saving a draft with `localStorage`, and restoring it in the right order (material before color, and only after the color list loads)
- Why the obvious way to get today's date can be off by a day (UTC vs local time)
- Showing photo previews with `URL.createObjectURL` without uploading anything
- Adding Open Graph tags so the link shows a preview card, and why messaging apps can keep showing an old preview

## Running It Locally

1. Clone or download this repository
2. In the project folder, run `python -m http.server`
3. Open http://localhost:8000

No installs or build steps needed. The color page and the color lists need a local server because browsers block `fetch` on files opened directly from your computer. The Send button may also need the live site, since some browsers only allow sharing on secure (https) pages.

## Future Improvements

- Send orders straight to my email when the customer taps Submit, without them having to pick an app or type my address
- Let customers tap a color on the color page to fill it into the order form
- Keep the summary easy to read in email apps that remove line breaks
- A painted finish option (sanded, primed, and hand painted) with starting prices by size