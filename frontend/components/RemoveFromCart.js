import { gql, useMutation } from '@apollo/client';
import styled from 'styled-components';

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &hover {
    color: var(--red);
    cursor: pointer;
  }
`;

const REMOVE_FROM_CART = gql`
  mutation REMOVE_FROM_CART($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function RemoveFromCart({ id }) {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART, {
    variables: { id },
    update,
    // optimisticResponse: {
    // 	deleteCartItem: {
    // 		id
    // 		__typename: 'CartItem',
    // 	}
    // }
  });

  return (
    <BigButton
      type="button"
      title="Remove this item from cart."
      disabled={loading}
      onClick={() => {
        removeFromCart().catch((err) => console.error(err.message));
      }}
    >
      &times;
    </BigButton>
  );
}
