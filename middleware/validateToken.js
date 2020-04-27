const TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

function validateToken(req, res, next) {
    console.log("Authenticating...");

    let bearerToken = req.headers.authorization;
    let headerToken = req.headers['book-api-key'];
    let paramToken = req.query.apiKey;

    if(!bearerToken || !headerToken || !paramToken) {
        res.statusMessage = "You need to send the 'authorization' token";
        return res.status(401).end();
    }

    if(bearerToken == `Bearer ${TOKEN}`) {
        next();
        return;
    }

    if(headerToken == TOKEN) {
        next();
        return;
    }

    if(paramToken ==   `Bearer ${TOKEN}`) {
        next();
        return;
    }
}

module.exports = validateToken;