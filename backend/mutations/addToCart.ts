import { KeystoneContext, SessionStore } from '@keystone-next/types';
import { CartItem } from '../schemas/CartItem';
import { Session } from '../types';
import { CartItemCreateInput } from '../.keystone/schema-types';

async function addToCart(
	root: any,
	{ productId }: { productId: string },
	context: KeystoneContext
): Promise<CartItemCreateInput> {
	// 1. Query current user and check if signed in.
	const sesh = context.session as Session;

	if (!sesh.itemId) {
		throw new Error('You must be logged in to add items to cart.');
	}

	// 2. Query the current Users cart
	const allCartItems = await context.lists.CartItem.findMany({
		where: { user: { id: sesh.itemId }, product: { id: productId } },
		resolveFields: 'id,quantity'
	});
	const [existingCartItem] = allCartItems;

	if (existingCartItem) {
		// 3. Check item is in cart.
		// 4. If it is increment by +1
		return await context.lists.CartItem.updateOne({
			id: existingCartItem.id,
			data: { quantity: existingCartItem.quantity + 1 },
			resolveFields: false,
		});
	}

	// 5. if it is not, create a new item in cart
	return await context.lists.CartItem.createOne({
		data: {
			product: { connect: { id: productId } },
			user: { connect: { id: sesh.itemId } },
		},
		resolveFields: false,
	});
}

export default addToCart;
