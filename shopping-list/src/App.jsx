import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { nanoid } from "nanoid";
import JSConfetti from "js-confetti";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";

const Container = styled.div`
  background-color: rgb(233, 230, 247);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(71, 62, 62, 0.1);
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  color: rgb(63, 24, 172);
  margin-bottom: 20px;
`;

const SubHeading = styled.h2`
  color: rgb(63, 24, 172);
  margin-top: 20px;
`;

const Alert = styled.div`
  background-color: rgb(79, 35, 202);
  border-color: rgb(24, 139, 51);
  color: white;
  font-size: 1.1rem;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
`;

const CustomForm = styled(Form)`
  margin-bottom: 30px;
  width: 100%;
`;

const FormLabel = styled(Form.Label)`
  font-weight: bold;
  color: rgb(63, 24, 172);
`;

const FormControl = styled(Form.Control)`
  border-radius: 5px;
  border: 1px solid #ddd;
  padding: 10px;
`;

const FormSelect = styled(Form.Select)`
  border-radius: 5px;
  border: 1px solid #ddd;
  padding: 10px;
`;

const SubmitButton = styled(Button)`
  background-color: rgb(63, 24, 172);
  color: white;
  border: none;
  margin-top: 10px;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1.1rem;

  &:hover {
    background-color: rgb(23, 40, 136);
  }
`;

const TableContainer = styled.div`
  margin-top: 30px;
`;

const StyledTable = styled(Table)`
  width: 100%;
  margin-top: 30px;
  border-collapse: collapse;
`;

const TableHeading = styled.th`
  background-color: rgb(240, 248, 255);
  color: rgb(63, 24, 172);
  padding: 10px;
`;

const TableRow = styled.tr`
  transition: background-color 0.3s;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  text-align: left;
  text-decoration: ${(props) => (props.isBought ? "line-through" : "none")};
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

function App() {
  const [shops] = useState([
    { id: 1, name: "Migros" },
    { id: 2, name: "Teknosa" },
    { id: 3, name: "BİM" },
  ]);

  const [categories] = useState([
    { id: 1, name: "Elektronik" },
    { id: 2, name: "Kırtasiye" },
    { id: 3, name: "Oyuncak" },
    { id: 4, name: "Bakliyat" },
    { id: 5, name: "Fırın" },
  ]);

  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const [selectedShopId, setSelectedShopId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const confettiCanvas = useRef(null);
  const jsConfetti = useRef(null);

  useEffect(() => {
    jsConfetti.current = new JSConfetti(confettiCanvas.current);
  }, []);

  const handleAddProduct = (event) => {
    event.preventDefault();
    if (newProductName && selectedShopId && selectedCategoryId) {
      const newProduct = {
        id: nanoid(),
        name: newProductName,
        shop: Number(selectedShopId),
        category: Number(selectedCategoryId),
        isBought: false,
      };
      setProducts([...products, newProduct]);
      setNewProductName("");
      setSelectedShopId("");
      setSelectedCategoryId("");
    }
  };

  const handleBought = (productId) => {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, isBought: !product.isBought }
        : product
    );
    setProducts(updatedProducts);
  };

  const handleDelete = (productId) => {
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );
    setProducts(updatedProducts);
  };

  useEffect(() => {
    const allBought = products.every((product) => product.isBought);
    if (allBought && products.length > 0 && showAlert === false) {
      setShowAlert(true);
      if (jsConfetti.current) {
        jsConfetti.current.addConfetti();
      }
    } else if (!allBought && showAlert === true) {
      setShowAlert(false);
    }
  }, [products, showAlert]);

  return (
    <Container>
      <Canvas ref={confettiCanvas} />
      <Heading>Alışveriş Listesi</Heading>

      {showAlert && <Alert role="alert">Alışveriş Tamamlandı! 🎉</Alert>}

      <CustomForm onSubmit={handleAddProduct}>
        <Form.Group className="mb-2">
          <FormLabel>Ürün Adı</FormLabel>
          <FormControl
            type="text"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            placeholder="Ürün Adı"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <FormLabel>Market</FormLabel>
          <FormSelect
            value={selectedShopId}
            onChange={(e) => setSelectedShopId(Number(e.target.value))}
          >
            <option value="">Seçiniz</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </FormSelect>
        </Form.Group>

        <Form.Group className="mb-3">
          <FormLabel>Kategori</FormLabel>
          <FormSelect
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
          >
            <option value="">Seçiniz</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </FormSelect>
        </Form.Group>

        <SubmitButton type="submit">Ürün Ekle</SubmitButton>
      </CustomForm>

      <SubHeading>Alınacak Ürünler</SubHeading>
      <TableContainer>
        {products.length > 0 ? (
          <StyledTable striped bordered hover>
            <thead>
              <tr>
                <TableHeading>Ürün Adı</TableHeading>
                <TableHeading>Market</TableHeading>
                <TableHeading>Kategori</TableHeading>
                <TableHeading>Durum</TableHeading>
                <TableHeading>İşlemler</TableHeading>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  className={product.isBought ? "table-success" : ""}
                >
                  <TableCell isBought={product.isBought}>
                    {product.name}
                  </TableCell>
                  <TableCell isBought={product.isBought}>
                    {shops.find((shop) => shop.id === product.shop)?.name ||
                      "Bilinmiyor"}
                  </TableCell>
                  <TableCell isBought={product.isBought}>
                    {categories.find((cat) => cat.id === product.category)
                      ?.name || "Bilinmiyor"}
                  </TableCell>
                  <TableCell isBought={product.isBought}>
                    {product.isBought ? "Alındı" : "Alınacak"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={product.isBought ? "warning" : "success"}
                      className="me-2"
                      onClick={() => handleBought(product.id)}
                    >
                      {product.isBought ? "Geri Al" : "Satın Al"}
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      Sil
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </StyledTable>
        ) : (
          <p>Henüz ürün eklenmedi.</p>
        )}
      </TableContainer>
    </Container>
  );
}

export default App;
