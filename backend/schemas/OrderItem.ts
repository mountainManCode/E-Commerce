import { list } from "@keystone-next/keystone/schema/dist/keystone.cjs";
import { text, select, integer, relationship } from "@keystone-next/fields";

export const OrderItem = list({
  // TODO ACCESS
  fields: {
    name: text({ isRequired: true }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    photo: relationship({
      ref: 'ProductImage',
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
      }
    }),
    price: integer(),
    quantity: integer(),
    order: relationship({ref: 'Order.items'}),
  },
});