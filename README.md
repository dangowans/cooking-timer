# 🔥 Barbecue Timer
A responsive web app timer specifically designed for flipping meat while barbecuing!

## Features

- **Quick Timer Options**: One-click timers for 30-second intervals from 30 seconds to 6 minutes
- **Custom Timer**: Set any custom time with minutes and seconds
- **Live Countdown**: Large, clear countdown display with original timer amount always visible
- **Timer Controls**: Add 30 seconds, pause/resume, and stop functionality
- **Audio & Vibration Alerts**: Plays chime and vibrates (on mobile) when timer expires
- **Visual Feedback**: Timer changes color during countdown and flashes when time is low
- **Screen Lock Compatible**: Timer continues accurately even when phone screen is off or locked
- **Background Notifications**: Receive notifications when timer completes, even in the background
- **Mobile Optimized**: Responsive design that works perfectly on phones and tablets

## How to Use

### Quick Timers
Click any of the preset buttons (30s, 1m, 1m 30s, etc.) to instantly start a timer.

### Custom Timer
1. Enter desired minutes and seconds in the input fields
2. Click "Set Timer" or press Enter to start

### During Timer Operation
- **+30s**: Add 30 seconds to the running timer
- **Pause/Resume**: Pause or resume the countdown
- **Stop**: Stop and reset the timer

### When Timer Expires
- A modal will appear with "🍖 Time to flip!" message
- Audio chime will play continuously
- Device will vibrate (on supported mobile devices)
- Click "Dismiss" to stop the alarm

## Technical Features

- **Timestamp-Based Timer**: Uses accurate timestamp calculations to ensure timer continues correctly even when screen is off
- **Page Visibility API**: Automatically recalculates remaining time when page becomes visible again
- **Web Audio API**: For alarm sounds
- **Vibration API**: For mobile device vibration
- **Wake Lock API**: Prevents screen from sleeping during timer (where supported)
- **Web Notifications API**: Sends notifications when timer completes in the background
- **Responsive Design**: Works on desktop, tablet, and mobile
- **No Dependencies**: Pure HTML, CSS, and JavaScript

## Getting Started

Simply open `index.html` in a web browser, or serve the files from any web server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .
```

Then visit `http://localhost:8000` in your browser.

## Perfect for Barbecuing! 

This timer is specifically designed for barbecue enthusiasts who need:
- Quick access to common grilling intervals
- Ability to add time without stopping
- Loud, persistent alerts that cut through outdoor noise
- Mobile-friendly interface for use at the grill
