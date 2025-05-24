# StriveSports

Creating a Sports management Application to manage community facilities (SD Assignment)

## Table of Contents
- [About](#about)
- [Technologies](#technologies)
- [Client](#client)
  - [Prerequisites](#client-prerequisites)
  - [Installation](#client-installation)
  - [Running the Client](#running-the-client)
  - [Client Rules & Instructions](#client-rules--instructions)
- [Server](#server)
  - [Prerequisites](#server-prerequisites)
  - [Installation](#server-installation)
  - [Starting the Server](#starting-the-server)
  - [Server Rules & Instructions](#server-rules--instructions)
-[Toast High vulnerabilty error fix](#high-severity-vulnerabilities)
  -[run this in terminal](#run-npm)


---

## About

This project is an assignment that we have for SD and we must undergo sprint methodologies to build and deploy a succesful running application.
To view all our scrum methodologies applied to make this a success head over to this link
- [Notion Dashboard](https://www.notion.so/SD-Project-1cce71bbe6ed80748a4ee19f4457aaf6?pvs=4)
- [Deployed site](https://blue-plant-09eedf103.6.azurestaticapps.net/)


## Technologies

List the major frameworks, libraries, and tools used in this project.

- **Client:** React, Javascript, Clerk, Vite
- **Server:** Node.js, Express, MongoDB, Mongoose, Cors

---

## Client

### Client Prerequisites(The root of the application no dedicated client folder)

Ensure you have the following installed:

- Node.js (>=14.x)
- npm run dev (to run the application on local host but ensure that the server is running server run instructions below)
- If there are error that you get ensure that you install the necessary npm i (wherever the app is missing them so that it can work)

### Client Installation

1. Clone the repo:
   ```bash
   git clone [https://github.com/your-org/your-repo.git](https://github.com/Rellow09-code/StriveSports.git)
   cd StriveSports then npm run dev
  - write the things in which you installed on the application e.g
    
  - These are for the dashboard things to install(npm install @mui/material@^5.17.1 @emotion/react @emotion/styled @mui/icons-material@^5.11.0 @mui/x-data-grid react-router-dom@6 react-pro-sidebar formik yup
)
  - for react icons (npm install react-icons react-router-dom@6)
  - npm install @clerk/clerk-react @clerk/clerk-sdk-node @emotion/react @emotion/styled @fullcalendar/common @fullcalendar/core @fullcalendar/daygrid @fullcalendar/interaction @fullcalendar/react @fullcalendar/timegrid @mui/icons-material @mui/material @mui/x-data-grid axios cors dotenv express formik gsap i mongodb mongoose nodemailer react react-calendar react-datepicker react-dom react-fast-marquee react-icons react-pro-sidebar react-router-dom react-simple-typewriter react-time-picker react-toastify recharts resend rollup yup
  - npm install --save-dev jest mongodb-memory-server mongoose
  - ensure that these installations are done on the root of the application .

## Server

### Server Prerequisites

Ensure you have the following installed:

- Node.js (>=14.x)
- Express installed and mongoose and mongodb
- The server must always run if you want to use the application then press the plus button to run the app normally as is .
- ensure that you cd server on vs code terminal then bash
- npm start

### Server Installation

1. cd server :
  -npm start , you should see server is connected listening to port 3000 and Mongodb is connected.
  - write the things in which you installed on the application ,if the terminal is crying and stuff e.g
  - npm install cors express mongoose

## Toast High vulnerabilty error fix
### run this in terminal
npm audit fix
