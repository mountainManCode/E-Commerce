import CreateProduct from '../components/CreateProduct';
import SignInGateway from '../components/SignInGateway';

export default function SellPage() {
  return (
    <div>
      <SignInGateway>
        <CreateProduct />
      </SignInGateway>
    </div>
  );
}
