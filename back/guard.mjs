import jwt from 'jsonwebtoken';

// General guard to check for any valid user token and restrict to admins
export const guard = (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).send('Authorization token is missing');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            console.error('Token verification failed:', err.message);
            return res.status(401).send('User is not authorized');
        } else {
            // Check if the user is an admin
            if (!data.isAdmin) {
                return res.status(403).send('You are not authorized to access this resource');
            }

            req.user = data; // Attach the user data to the request
            next();
        }
    });
};

// Helper function to extract the user from the token
export const getUser = req => {
    const token = extractToken(req);

    if (!token) {
        return null; 
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return user; 
    } catch (err) {
        console.error('Error verifying token in getUser:', err.message);
        return null; 
    }
};

// Function to extract the token from the Authorization header
export const extractToken = req => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return null; 
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7, authHeader.length) : authHeader;

    return token;
};
