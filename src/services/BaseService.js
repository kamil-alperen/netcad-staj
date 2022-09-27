const express = require('express');
var cors = require('cors')

const app = express();
app.use(cors())

app.post('/gisapi/authentication/login', (req, res) => {
    const response = {
        code : "RJa8pMDDpkZz6ylE8sKaxQ%3D%3D",
        sessionId : "ca61828453ad4520a3f48004995bf31e"
    }
    res.send(response);
});

app.get('/Netigma633/gisapi/v4/filearchive/show', (req, res) => {
    const code = req.query.code;
    const sessionId = req.query.sessionId;

    const goURL = `/pdfviewer/code=${code}/sessionId=${sessionId}`
    res.send(goURL);
})

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

