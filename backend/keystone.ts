import { config } from '@keystone-6/core';
import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';
import 'dotenv/config';
import { CartItem } from './schemas/CartItem';
import { Order } from './schemas/Order';
import { OrderItem } from './schemas/OrderItem';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { Role } from './schemas/Role';
import { User } from './schemas/User';
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { extendGraphqlSchema } from './mutations';
import { permissionsList } from './schemas/fields';

const databaseURL =
	process.env.DATABASE_URL_AVN || 'file:./keystone.db';
	// 'mongodb://localhost/keystone-tailspin';

const sessionConfig = {
	maxAge: 60 * 60 * 24 * 360, // Stay signed in -> 1year.
	secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
	listKey: 'User',
	identityField: 'email',
	secretField: 'password',
	initFirstItem: {
		fields: ['name', 'email', 'password'],
		// TODO: Add in inital roles here
	},
	passwordResetLink: {
		async sendToken(args) {
			// send the email
			await sendPasswordResetEmail(args.token, args.identity);
		},
	},
	sessionData: `id name email role { ${permissionsList.join(' ')} }`,
});

export default withAuth(
	config({
		server: {
			cors: {
				origin: [process.env.FRONTEND_URL!],
				credentials: true,
			},
		},
		db: {
			provider: 'postgresql', // postgresql  sqlite
			url: databaseURL,
			async onConnect(context) {
				console.log('Connected to the database!');
				if (process.argv.includes('--seed-data')) {
					await insertSeedData(context);
				}
			},
		},
		lists: {
			// Schema items go in here
			User,
			Product,
			ProductImage,
			CartItem,
			OrderItem,
			Order,
			Role
		},
		extendGraphqlSchema,
		ui: {
			// Show the UI only for poeple who pass this test
			isAccessAllowed: ({ session }) =>
				// console.log(session);
				!!session
		},
		session: statelessSessions(sessionConfig)
	})
);
