import { KeystoneContext } from '@keystone-6/core/types';
import { Session } from '../types';

async function addToCart(
	root: any,
	{ productId }: { productId: string },
	context: KeystoneContext
): Promise<any> {
	// 1. Query current user and check if signed in.
	const sesh = context.session as Session;

	if (!sesh.itemId) {
		throw new Error('You must be logged in to add items to cart.');
	}

	// 2. Query the current Users cart
	const allCartItems = await context.db.CartItem.findMany({
		where: { user: { id: { equals: sesh.itemId } }, product: { id: { equals: productId } } },
		// resolveFields: 'id,quantity'
	});
	const [existingCartItem] = allCartItems;

	if (existingCartItem) {
		// 3. Check item is in cart.
		// 4. If it is increment by +1
		return await context.db.CartItem.updateOne({
			where: { id: existingCartItem.id },
			data: { quantity: existingCartItem.quantity + 1 },
			// resolveFields: false,
		});
	}

	// 5. if it is not, create a new item in cart
	return await context.db.CartItem.createOne({
		data: {
			product: { connect: { id: productId } },
			user: { connect: { id: sesh.itemId } },
		},
		// resolveFields: false,
	});
}

export default addToCart;
