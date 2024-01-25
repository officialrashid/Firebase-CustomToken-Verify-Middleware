import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

const serviceAccount = require('./brototype-29983-firebase-adminsdk-9qeji-41b48a5487.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://brototype-29983.firebaseio.com',
});

const verifyTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idToken = req.headers['authorization-customtoken']; // Assuming the token is sent in the Authorization header

    if (!idToken) {
      throw new Error('No token provided');
    }

    const tokenValue = Array.isArray(idToken) ? idToken[0] : idToken as string;

    console.log(tokenValue, "idToken comnggggg");
    
    await admin.auth().verifyIdToken(tokenValue)
      .then((decodedToken) => {
        console.log("successssss");
        
        const uid = decodedToken.uid;
        console.log(uid, "syuccess user uiddd");
        
        // You can do further verification or processing here
        (req as any).user = { uid };
        // Assuming you want to attach the UID to the request
        next();
      })
      .catch((error) => {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Unauthorized' });
      });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default verifyTokenMiddleware;
