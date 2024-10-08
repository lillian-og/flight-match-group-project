// index.js
// Required modules
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
var turf = require('@turf/turf');
// Initialize Express application
const app = express();

// Define paths
const clientPath = path.join(__dirname, '..', 'client/src');
const dataPath = path.join(__dirname, 'data', 'users.json');
const serverPublic = path.join(__dirname, 'public');
// Middleware setup
app.use(express.static(clientPath)); // Serve static files from client directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Routes

// Home route
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: clientPath });
});

app.get('/users', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf8');

        const users = JSON.parse(data);
        if (!users) {
            throw new Error("Error no users available");
        }
        res.status(200).json(users);
    } catch (error) {
        console.error("Problem getting users" + error.message);
        res.status(500).json({ error: "Problem reading users" });
    }
});

// Form route
app.get('/sign-up', (req, res) => {
    res.sendFile('pages/sign-up.html', { root: serverPublic });
});

app.get('/user-management', (req, res) => {
    res.sendFile('pages/user-management.html', { root: serverPublic });
});

app.get('/log-in', (req, res) => {
    res.sendFile('pages/log-in.html', { root: serverPublic });
});

app.get('/user-info', (req, res) => {
    res.sendFile('pages/user-info.html', { root: serverPublic });
});

app.get('/About-Us', (req, res) => {
    res.sendFile('/Airplane-About/About-Us.html', { root: clientPath });
});


// Form submission route
app.post('/submit-form', async (req, res) => {
    try {
        const { name, email, password, message } = req.body;

        // Read existing users from file
        let users = [];
        try {
            const data = await fs.readFile(dataPath, 'utf8');
            users = JSON.parse(data);
        } catch (error) {
            // If file doesn't exist or is empty, start with an empty array
            console.error('Error reading user data:', error);
            users = [];
        }

        // Find or create user
        let user = users.find(u => u.name === name && u.email === email);
        if (user) {
            user.messages.push(message);
        } else {
            user = { name, email, password, messages: [message] };
            users.push(user);
        }

        // Save updated users
        await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
        res.redirect('/sign-up');
    } catch (error) {
        console.error('Error processing form:', error);
        res.status(500).send('An error occurred while processing your submission.');
    }
});

//flight search
app.get('/getLocoInfo/:fromCity/:fromState/:toState/:toCity', async (req, res) => {
    try {
        const { fromCity, fromState, toCity, toState } = req.params;
        console.log(toCity)
        async function getFrom(city, state) {
            const url = "https://api.mapbox.com/search/geocode/v6/forward?q=" + city + "%20" + state + "&proximity=ip&access_token=pk.eyJ1IjoiY21hbGNvNzA5IiwiYSI6ImNtMXk3eW0zOTE2YTIybXExdjBlOTdnb3QifQ.NLUWCxQsJmH5c1OBjx3z5g";
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                const json = await response.json();
                fromLong = json.features[0].geometry.coordinates[0]
                fromLat = json.features[0].geometry.coordinates[1];
                return [fromLat, fromLong]
            } catch (error) {
                console.error(error.message);
            }
        }


        async function getTo(city, state) {
            const url = "https://api.mapbox.com/search/geocode/v6/forward?q=" + city + "%20" + state + "&proximity=ip&access_token=pk.eyJ1IjoiY21hbGNvNzA5IiwiYSI6ImNtMXk3eW0zOTE2YTIybXExdjBlOTdnb3QifQ.NLUWCxQsJmH5c1OBjx3z5g";
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const json = await response.json();
                toLong = json.features[0].geometry.coordinates[0]
                toLat = json.features[0].geometry.coordinates[1];
                return [toLat, toLong]
            } catch (error) {
                console.error(error.message);
            }

        }

        async function calculateMiles(fromCity, fromState, toCity, toState) {
            const fromCoord = await getFrom(fromCity, fromState)
            const toCoord = await getTo(toCity, toState)
            var from = turf.point(fromCoord);
            var to = turf.point(toCoord);
            var options = { units: "miles" };
            var distance = turf.distance(from, to, options)
            console.log(distance + " miles")
            return distance
        }
        milesDistance = await calculateMiles(fromCity, fromState, toCity, toState)
        console.log(milesDistance)
        res.status(200).json(milesDistance);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('An error occurred while updating the user.');
    }
});



app.get('/submitLocations/:fromCity/:fromState/:toState', async (req, res) => {
    try {
        const { fromCity, fromState, toCity, toState } = req.params;
        const data = await fs.readFile(flightDataPath, 'utf8');
        if (data) {
            function getIndex(state) {
                if (state == "alabama" || state == "al") {
                    return 0
                }
                if (state == "alaska" || state == "ak") {
                    return 1
                }
                if (state == "arizona" || state == "az") {
                    return 2
                }
                if (state == "arkansas" || state == "ar") {
                    return 3
                }
                if (state == "california" || state == "ca") {
                    return 4
                }
                if (state == "colorado" || state == "co") {
                    return 5
                }
                if (state == "connecticut" || state == "ct") {
                    return 6
                }
                if (state == "delaware" || state == "de") {
                    return 7
                }
                if (state == "florida" || state == "fl") {
                    return 8
                }
                if (state == "georgia" || state == "ga") {
                    return 9
                }
                if (state == "hawaii" || state == "hi") {
                    return 10
                }
                if (state == "idaho" || state == "id") {
                    return 11
                }
                if (state == "illinois" || state == "il") {
                    return 12
                }
                if (state == "indiana" || state == "in") {
                    return 13
                }
                if (state == "iowa" || state == "ia") {
                    return 14
                }
                if (state == "kansas" || state == "ks") {
                    return 15
                }
                if (state == "kentucky" || state == "ky") {
                    return 16
                }
                if (state == "louisiana" || state == "la") {
                    return 17
                }
                if (state == "maine" || state == "me") {
                    return 18
                }
                if (state == "maryland" || state == "az") {
                    return 19
                }
                if (state == "massachusetts" || state == "ma") {
                    return 20
                }
                if (state == "michigan" || state == "mi") {
                    return 21
                }
                if (state == "minnesota" || state == "mn") {
                    return 22
                }
                if (state == "mississippi" || state == "ms") {
                    return 23
                }
                if (state == "missouri" || state == "mo") {
                    return 24
                }
                if (state == "montana" || state == "mt") {
                    return 25
                }
                if (state == "nebraska" || state == "ne") {
                    return 26
                }
                if (state == "nevada" || state == "nv") {
                    return 27
                }
                if (state == "new hampshire" || state == "nh") {
                    return 28
                }
                if (state == "new jersey" || state == "nj") {
                    return 29
                }
                if (state == "new mexico" || state == "nm") {
                    return 30
                }
                if (state == "new york" || state == "ny") {
                    return 31
                }
                if (state == "north carolina" || state == "nc") {
                    return 32
                }
                if (state == "north dakota" || state == "nd") {
                    return 33
                }
                if (state == "ohio" || state == "oh") {
                    return 34
                }
                if (state == "oklahoma" || state == "ok") {
                    return 35
                }
                if (state == "oregon" || state == "or") {
                    return 36
                }
                if (state == "pennsylvania" || state == "pa") {
                    return 37
                }
                if (state == "rhode island" || state == "ri") {
                    return 38
                }
                if (state == "south carolina" || state == "sc") {
                    return 39
                }
                if (state == "south dakota" || state == "sd") {
                    return 40
                }
                if (state == "tennessee" || state == "tn") {
                    return 41
                }
                if (state == "texas" || state == "tx") {
                    return 42
                }
                if (state == "utah" || state == "ut") {
                    return 43
                }
                if (state == "vermont" || state == "vt") {
                    return 44
                }
                if (state == "virginia" || state == "va") {
                    return 45
                }
                if (state == "washington" || state == "wa") {
                    return 46
                }
                if (state == "west virginia" || state == "wv") {
                    return 47
                }
                if (state == "wisconsin" || state == "wi") {
                    return 48
                }
                if (state == "wyoming" || state == "wy") {
                    return 49
                }
            }
            let fromIndex = getIndex(fromState)
            let toIndex = getIndex(toState)
            let flightData = JSON.parse(data);
            let flightsAvail = flightData[fromIndex].toState[toIndex].toState
            // console.log(flightsAvail)
            res.status(200).json(flightsAvail);
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('An error occurred while updating the user.');
    }
});


app.post('/log-in', async (req, res) => {
    try {
        const { name, password } = req.body;

        // Read users from the data file
        const data = await fs.readFile(dataPath, 'utf8');
        const users = JSON.parse(data);

        // Find the user
        const user = users.find(u => u.name === name && u.password === password);

        if (user) {
            // Return the user object
            res.status(200).json(user);
        } else {
            // User not found
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user route (currently just logs and sends a response)
app.put('/update-user/:currentName/:currentEmail/:currentPassword', async (req, res) => {
    try {
        const { currentName, currentEmail, currentPassword } = req.params;
        const { newName, newEmail, newPassword } = req.body;
        console.log('Current user:', { currentName });
        console.log('Current email:', { currentEmail });
        console.log('Current email:', { currentPassword });
        console.log('New user data:', { newName, newEmail, newPassword });
        const data = await fs.readFile(dataPath, 'utf8');
        if (data) {
            let users = JSON.parse(data);
            const userIndex = users.findIndex(user => user.name === currentName && user.email === currentEmail && user.password == currentPassword);
            console.log(userIndex);
            if (userIndex === -1) {
                return res.status(404).json({ message: "User not found" })
            }
            users[userIndex] = { ...users[userIndex], name: newName, email: newEmail, password: newPassword };
            console.log(users);
            await fs.writeFile(dataPath, JSON.stringify(users, null, 2));

            res.status(200).json({ message: `You sent ${newName}` });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('An error occurred while updating the user.');
    }
});

app.delete('/user/:name', async (req, res) => {
    try {
        console.log(req.params);
        const { name } = req.params;
        let users = [];
        try {
            const data = await fs.readFile(dataPath, 'utf8');
            users = JSON.parse(data);
        } catch (error) {
            return res.status(404).send('Data not found');
        }
        const userIndex = users.findIndex(user => user.name === name);
        // console.log(userIndex);
        if (userIndex === -1) {
            return res.status(404).send('User not found');
        }
        users.splice(userIndex, 1);
        try {
            await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
        } catch (error) {
            console.error('failed to write to database')
        }
        res.send('User deleted successfully');
    } catch (error) {
        res.status(500).send('There was an error deleting user');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});