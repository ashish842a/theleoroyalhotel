const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    console.error(`[DEBUG] verifyToken: Cookie=${!!token}, TokenLength=${token ? token.length : 0}`);

    if (!token) return next(createError(401, "You are not authenticated!"));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error(`[DEBUG] verifyToken: JWT Verification Failed: ${err.message}`);
            return next(createError(403, "Token is not valid!"));
        }
        console.error(`[DEBUG] verifyToken: Success. UserID=${user.id}, Role=${user.role}`);
        req.user = user;
        next();
    });
};

const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        const paramId = req.params.id || req.params.userId;
        const msg = `[DEBUG] VERIFY USER: TokenID=${req.user.id}, ParamID=${paramId}, Role=${req.user.role}\n`;
        try { require('fs').appendFileSync('server_requests.log', msg); } catch (e) { }
        console.error(msg.trim());

        if (req.user.id === paramId || req.user.role === 'admin') {
            next();
        } else {
            try { require('fs').appendFileSync('server_requests.log', "[DEBUG] VERIFY USER FAILED: Mismatch and not admin\n"); } catch (e) { }
            console.error("[DEBUG] VERIFY USER FAILED: Mismatch and not admin");
            return next(createError(403, "You are not authorized!"));
        }
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            return next(createError(403, "You are not authorized!"));
        }
    });
};

const createError = (status, message) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
};

const verifyTokenOptional = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return next();

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (!err) req.user = user;
        next();
    });
};

module.exports = { verifyToken, verifyUser, verifyAdmin, verifyTokenOptional, createError };
