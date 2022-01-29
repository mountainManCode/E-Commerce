import { list, graphql } from "@keystone-6/core";
import { text, integer, relationship, virtual } from "@keystone-6/core/fields";
import formatMoney from "../lib/formatMoney";
import { isSignedIn, rules } from "../access";

export const Order = list({
  access: {
		operation: {
			create: isSignedIn,
			update: () => false,
			delete: () => false,
		},
		filter: { query: rules.canOrder },
	},
  fields: {
		label: virtual({
			field: graphql.field({
				type: graphql.String,
				resolve(item) {
					return `${formatMoney((item as any).total)}`;
				}
			}),
		}),
		total: integer(),
		items: relationship({ ref: 'OrderItem.order', many: true}),
    user: relationship({ ref: 'User.orders' }),
		charge: text()
  },
});