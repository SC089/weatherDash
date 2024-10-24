import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
dotenv.config();
// Import the routes
import routes from './routes/index.js';
const app = express();
const PORT = process.env.PORT || 3001;
// TODO: Serve static files of entire client dist folder
// app.use(express.static(path.join(process.cwd(), '../../client/dist')));
const publicPath = path.join(process.cwd(), '../client/dist');
app.use(express.static(publicPath));
app.get('*', (_, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});
// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// TODO: Implement middleware to connect the routes
app.use(routes);
// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
