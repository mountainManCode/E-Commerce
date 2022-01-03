import Head from 'next/head';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import DisplayError from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';
import formatMoney from '../lib/formatMoney';

export const SINGLE_ORDER_QUERY = gql`
  query Single_Order_Query($id: ID!) {
    order: Order(where: { id: $id }) {
      id
      charge
      items {
        id
        description
        name
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
      total
      user {
        id
      }
    }
  }
`;

export default function SingleOrder({ id }) {
  const { data, error, loading } = useQuery(SINGLE_ORDER_QUERY, {
    variables: {
      id,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { order } = data;
  return (
    <OrderStyles>
      <Head>
        <title>Tail Spin | {order.id}</title>
      </Head>
      <p>
        <span>Order ID: </span>
        <span>{order.id}</span>
      </p>
      <p>
        <span>Charge #: </span>
        <span>{order.charge}</span>
      </p>
      <p>
        <span>Order total: </span>
        <span>{formatMoney(order.total)}</span>
      </p>
      <p>
        <span>Item count: </span>
        <span>{order.items.length}</span>
      </p>
      <div className="items">
        {order.items &&
          order.items.map((item) => (
            <div className="order-item" key={item.id}>
              <img
                src={item.photo.image.publicUrlTransformed}
                alt={item.title}
              />
              <div className="item-details">
                <h2>{item.name}</h2>
                <p>Qty: {item.quantity}</p>
                <p>Price: {formatMoney(item.price)}</p>
                <p>Sub Total: {item.price * item.quantity}</p>
                <p>{item.description}</p>
              </div>
              <div>Quantity: {item.quantity}</div>
              <p>ID: {item.id}</p>
            </div>
          ))}
      </div>
    </OrderStyles>
  );
}
