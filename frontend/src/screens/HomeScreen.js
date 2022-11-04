import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import Meta from "../components/Meta";
import { listProducts } from "../actions/productActions";

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;
  const [sortBy, setSortBy] = useState();
  const [filterBy, setFilterBy] = useState();

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  const [data, setData] = useState([]);

  useEffect(() => {
    setData([...products]);
  }, [products]);

  useEffect(() => {
    const filterProducts = (filterBy) => {
      if (filterBy === 'Select Category'){
        setData(products)
      }
      else{
      const filtered =  products.filter(item => item.category == filterBy);
      setData(filtered)
      }
    }
    filterProducts(filterBy)
  },[filterBy]);

  useEffect(() => {
    const sortProducts = (sortBy) => {
      if (sortBy === "name") {
        const sorted = [...data].sort((a, b) => {
          const nameA = a.name.toUpperCase(); // ignore upper and lowercase
          const nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        setData(sorted);
      } else if (sortBy === "price") {
        const sorted = [...data].sort((a, b) => a.price - b.price);
        setData(sorted);
      } else if (sortBy === "createdAt") {
        const sorted = [...data].sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setData(sorted);
      }
    };
    sortProducts(sortBy);
  }, [sortBy]);

  return (
    <>
      <Meta />
      <h1>Latest Products</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <label>Sort Products By:</label>

          <select name="name" onChange={(e) => setSortBy(e.target.value)}>
            <option>---------</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="createdAt">Date</option>
          </select>
          
          <label>Filter Products By:</label>
          <select name="category" onChange={(e) => setFilterBy(e.target.value)}>
            <option>Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="cycles">Cycle</option>
            <option value="calculator">Calculator</option>
            <option value="apparel">Apparel</option>
            <option value="books">Books</option>
            <option value="other">Other</option>
          </select>
          <Row>
            {data.map((product) => (
              <Col key={product._id} xs={6} sm={6} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
