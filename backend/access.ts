import { permissionsList } from "./schemas/fields";
import { ListAccessArgs } from "./types";

// At its simplest, the access control returns a yes or no value depending on the users session.
export function isSignedIn({ session }): ListAccessArgs {
	return !!session;
}

const generatedPermissions = Object.fromEntries(permissionsList.map( permission => [
	permission,
	function({ session }: ListAccessArgs) {
		return !!session?.data.role?.[permission];
	}
]));

// Permissions check if someone meets criteria - yes or no.
export const permissions = {
	...generatedPermissions,
	// guest({ session }: ListAccessArgs ): boolean {
	// 	return !session?.data.role;
	// },
}

// Rule based function
// Rules can return a boolean - yes or no - or filter with limits on which products they can CRUD
export const rules = {
	canManageProducts({ session }: ListAccessArgs ) {
		if(!isSignedIn({ session }) ) {
			return false;
		}

		// Do they have the permission of canManageProducts
		if(permissions.canManageProducts({ session })) {
			return true;
		}
		// 2. If not, do they own this item?
		// return the Where filter, and if finds nothing, returns a falsey value.
		return { user: { id: session.itemId }};
	},
	canOrder({ session }: ListAccessArgs ) {
		if(!isSignedIn({ session }) ) {
			return false;
		}

		// Do they have the permission of canManageCart
		if(permissions.canManageCart({ session })) {
			return true;
		}
		// 2. If not, do they own this item?
		// return the Where filter, and if finds nothing, returns a falsey value.
		return { user: { id: session.itemId }};
	},
	canManageOrderItems({ session }: ListAccessArgs ) {
		if(!isSignedIn({ session }) ) {
			return false;
		}

		// Do they have the permission of canManageCart
		if(permissions.canManageCart({ session })) {
			return true;
		}
		// 2. If not, do they own this item?
		// return the query Order -> user -> itemId (using Where filter), and if finds nothing, returns a falsey value.
		return { order: { user: { id: session.itemId }}};
	},
	canReadProducts({ session }: ListAccessArgs) {
		if(!isSignedIn({ session }) ) {
			return false;
		}

		if( permissions.canReadProducts ) {
			return true; // They can read everything.
		}

		// They should only see available products (based on  the status field).
		return { status: 'AVAILABLE' };
	},
	canManageUsers({ session }: ListAccessArgs ) {
		if(!isSignedIn({ session }) ) {
			return false;
		}

		// Do they have the permission of canManageUsers
		if(permissions.canManageUsers({ session })) {
			return true;
		}
		// 2. Otherwise, can only update themselves.
		return { id: session.itemId };
	},
}