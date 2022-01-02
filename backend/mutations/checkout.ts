import { KeystoneContext, SessionStore } from '@keystone-next/types';
import { Session } from '../types';
import { CartItemCreateInput, OrderCreateInput } from '../.keystone/schema-types';
import { CartItem } from '../schemas/CartItem';
import StripeConfig from '../lib/stripe';
import { Order } from '../schemas/Order';

interface Arguments {
	token: string
}

const graphql = String.raw;

async function checkout(
	root: any,
	{ token }: Arguments,
	context: KeystoneContext
): Promise<OrderCreateInput> {
	// 1. Make sure they are signed in
	const userId = context.session.itemId;
	if(!userId) {
		throw new Error('You must be signed in to create an order!');
	}
	// 2. Query the current User
	const user = await context.lists.User.findOne({
		where: {id: userId },
		resolveFields: graphql`
			id
			name
			email
			cart {
				id
				quantity
				product {
					id
					description
					name
					price
					photo {
						id
						image {
							id
							publicUrlTransformed
						}
					}
				}
			}
		`
	});
	// Filter out items in Cart with Products that have been deleted.
	const cartItems = user.cart.filter(cartItem => cartItem.product);

	// 3. calc the total price for their order.
	const amount = cartItems.reduce( (tally: number, cartItem: CartItemCreateInput) => {
		return tally + cartItem.quantity * cartItem.product.price;
	},0);
	console.log( amount);
	// 4. Create the charge with the stripe library
	const charge = await StripeConfig.paymentIntents.create({
		amount,
		currency: 'USD',
		confirm: true,
		payment_method: token
	}).catch(err => {
		console.log(err);
		throw new Error(err.message);
	});
	console.log(charge);
	// 5.  Convert the cartItems to orderItems
	const orderItems = cartItems.map(cartItem => {
		const orderItem = {
			name: cartItem.product.name,
			description: cartItem.product.description,
			price: cartItem.product.price,
			photo: { connect: { id: cartItem.product.photo.id }},
			quantity: cartItem.quantity
		}
		return orderItem;
	});
	// 6. Create the order and return it.
	const order = await context.lists.Order.createOne({
		data: {
			total: charge.amount,
			charge: charge.id,
			items: { create: orderItems },
			user: { connect: { id: userId }}
		}
	});
	// 6. Clean up any old cart item
	const cartItemIds = user.cart.map(cartItem => cartItem.id);
	await context.lists.CartItem.deleteMany({
		ids: cartItemIds
	});

	return order;
}

export default checkout;
