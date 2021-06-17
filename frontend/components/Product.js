import Link from 'next/Link';
import formatMoney from '../lib/formatMoney';
import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import DeleteProduct from './DeleteProduct';

export default function Product({ product }) {
  return (
    <ItemStyles>
      <img
        src={product?.photo?.image?.publicUrlTransformed}
        alt={product.name}
      />

      <Title>
        <Link href={`/product/${product.id}`}>{product.name}</Link>
      </Title>

      <PriceTag>{formatMoney(product.price)}</PriceTag>

      <p>{product.description}</p>

      <div className="buttonList">
        <Link
          href={{
            pathname: 'update',
            query: { id: product.id },
          }}
        >
          Edit
        </Link>
        <DeleteProduct id={product.id}>Delete</DeleteProduct>
      </div>
    </ItemStyles>
  );
}
