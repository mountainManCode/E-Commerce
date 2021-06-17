import { gql, useQuery, useMutation } from '@apollo/client';
import { SINGLE_ITEM_QUERY } from './SingleProduct';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';

// TODO: Update Image.

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $description: String
    $price: Int
  ) {
    updateProduct(
      id: $id
      data: { name: $name, description: $description, price: $price }
    ) {
      id
      name
      description
      price
    }
  }
`;

export default function UpdateProduct({ id }) {
  // 1. we need to get the existing product.
  const { data, error, loading } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id },
  });

  // 2. we need to get the mutation to update the product.
  const [
    updateProduct,
    { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_PRODUCT_MUTATION);

  // 2.5 create some state for From inputs
  const { inputs, handleChange, clearForm } = useForm(
    data?.Product || {
      name: '',
      description: '',
      price: '',
    }
  );

  if (loading) return <p>Loading...</p>;

  // 3. We need the form to handle the updates.
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        await updateProduct({
          variables: {
            id,
            name: inputs.name,
            description: inputs.description,
            price: inputs.price,
          },
        }).catch(console.error);
      }}
    >
      <DisplayError error={error || updateError} />

      <fieldset disabled={updateLoading} aria-busy={updateLoading}>
        <label htmlFor="name">
          Name
          <input
            required
            type="text"
            id="name"
            name="name"
            placeholder="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            required
            type="number"
            id="price"
            name="price"
            placeholder="price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>

        <button type="button" onClick={clearForm}>
          Clear Form
        </button>
        <button type="submit">Update Product</button>
      </fieldset>
    </Form>
  );
}
