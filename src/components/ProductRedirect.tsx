import { Navigate, useParams } from "react-router-dom";

const ProductRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/products/${id}`} replace />;
};

export default ProductRedirect;
