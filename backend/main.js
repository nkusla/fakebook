const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./models/index').sequelize;

const userRoute = require('./routes/userRoute');
const friendshipRoute = require('./routes/friendshipRoute');
const postRoute = require('./routes/postRoute');
const placeRoute = require('./routes/placeRoute');

const app = express();

app.use(cors({
	origin: process.env.FRONTEND_URL,
	credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/user', userRoute);
app.use('/api/friendship', friendshipRoute);
app.use('/api/post', postRoute);
app.use('/api/place', placeRoute);

app.get("/api/ping", (_, res) => {
	res.status(200).json({ message: "pong" });
});

sequelize.authenticate().then(() => {
	console.log(`Connection to the ${process.env.DB_NAME} database has been established successfully!`);
	app.listen(process.env.PORT, () => {
		console.log(`Server is running on port ${process.env.PORT}`);
	});
}).catch(err => {
	console.error('Unable to connect to the database!', err);
});