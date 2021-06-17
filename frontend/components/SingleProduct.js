import Head from 'next/head';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import DisplayError from './ErrorMessage';

const ProductStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: var(--maxWidth);
  justify-content: center;
  align-items: center;
  gap: 2rem;
  img {
    width: 100%;
    object-fit: contain;
  }
`;

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      price
      description
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function SingleProduct({ id }) {
  const { data, loading, error } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      id,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { Product } = data;
  return (
    <ProductStyles>
      <Head>
        <title>Tail Spin | {Product.name}</title>
      </Head>
      <div className="details">
        <img
          src={Product.photo.image.publicUrlTransformed}
          alt={Product.photo.altText}
          height="400"
        />
        <h2>{Product.name}</h2>
        <p>{Product.description}</p>
      </div>
    </ProductStyles>
  );
}
