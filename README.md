# AllergyAllies


AllergyAlly includes a mobile application for patients undergoing subcutaneous immunotherapy for environmental allergy desensitization, as well as a practitioner web application for patient monitoring. The app has a variety of functionalities, including calculating the patient’s next dosage, tracking their appointment attendance, and alerting practitioners of patients who are at risk of attrition. This will be a highly useful tool in ensuring the effectiveness of patients’ therapy, as poor compliance with injection schedules can set treatment backwards. Additionally, it will help to reduce rates of attrition for patients. To build the frontend of the app, we used React Native with Expo. We also used a MongoDB database to maintain patient and practice accounts that include all relevant data, and an Express and Node backend to tie together all functionalities of the app.

[Project Demo](https://youtu.be/n-p6PPq_3Hg)

---
This project requires node. You can verify this with:
        node -v
[How to install node](https://phoenixnap.com/kb/install-node-js-npm-on-window)

---

Backend instructions:

1. Verify database access: set URI in .env and whitelist your IP

2. Open terminal window in /backend

3. (First time only) Run:

        npm install --save-dev nodemon

4. Run:

        npm start

* For unit tests run: npm test <file_path> 

---

Frontend instructions:
Install Expo CLI globally by running the command
        npm i -g expo cli

        Web App:
1. Verify correct backend URL in app.json.expo.database (currently localhost/5000)
2. Open terminal window in /frontend
3. (First time only) Run:

        npm install @react-navigation/native
        npx expo install react-native-screens react-native-safe-area-context
        npm install file-saver
        npm install detect-browser

4. Run:

        npx expo start -w

        Mobile App:
1. Download Expo Go app
2. Verify correct backend URL in .env (your IP address)
3. Open terminal window in /frontend_mobile
4. (First time only) Run:

        npm install @react-navigation/native
        npx expo install react-native-screens react-native-safe-area-context

5. Run:

        npx expo start
6. Scan QR code to open in Expo Go

---

*COMMON ERRORS* <br>

If axios requests are timing out, make sure you have your IP set correctly

You should have both the frontend and backend running in two different terminal windows.

Sometimes, the mobile app does not work on certain public WiFi networks (error about LAN URL). Eduroam and most private WiFi networks should work.

---

*RECOMMENDED CODE IMPROVEMENTS* <br>

Minimize repeated code on the Patient mobile app by putting the Axios requests and common operations all into a helper function file

Use third-party user auth such as Firebase for better security, and to implement forgot password, verify email, etc. functionality.

Improve date handling throughout to a unified format

Clean up unnessesary field in database

Some known issues:
- Database discrepancies cause application to behave unexpectedly and crash occasionally

---

*FEATURES IN BACKLOG* <br>

- Push notification reminders about upcoming appointment deadline for patients
- Patient percent compliance calculation
- Admin users
- SNOT Surveys to track patient symptoms (form has been created but not connected to backend) -> send to patients every X months
- Patient ability to upload pictures and send to providers of adverse reactions
- Display provider's scrolling ads on patient home screen (uploaded by provider in practice survey)
- Fully integrate patient reporting of adverse reactions
- Geolocation tracking of appointment attendance
- Scheduling appointments in the future
- Vial testing
- Different staff types (ie. Providers, nurses)
- Invitation based provider signup (instead of code and NPI)
- Make app deployable and connected to Dr. Williams website


---

*PROJECT STRUCTURE* <br>

- Models:
  - Practice: An office that patients go to and providers work for. Contains reference to NPI of all providers
  - Provider: A doctor who works at a practice
  - Patient: Those undergoing treatment. Contain list of references to treatments and personal maintence bottle numbers
  - Treatment: An appointment. Contains date and details about injections received, as well as any reaction
  - Bottle/Vial: (sub type) type of antigen being treated. Has bottle number, volume, and dilution.
  - Protocol: practice specific details about treatment process like dosage adjustments and bottle types
  - Reports: generated information about patients. 4 types: Attrition, Approaching Maintenance, Refills, and Needs Retest
  - Alerts: alerts for providers that tell them when someone is at risk of attrition or had bad reaction
- Front-End
  - Source code for pages is in 'screens'
  - User.js can be used to access the current User's information
  - Injection, maintenance bottle numbers, and practice survey screens were created with SurveyJS
  - Uses React State Hooks to store screen info
- Back-End
  - Each collection within the database (ex: patients, providers, protocols, injections, etc.) should have one file in each of the following:
    - Controllers - Functions to handle data and interactions with the database when a request is made to a specific route
    - Routes - Specific routes that are associated to functions within the controller
    - Models - Mongoose schemas for each collection in the database






