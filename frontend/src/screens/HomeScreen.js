import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import Meta from '../components/Meta'
import { listProducts } from '../actions/productActions'

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword

  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;
  const [sortBy, setSortBy] = useState('name');
  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])
  
  const [data, setData] = useState([]);

  useEffect(()=> {
    setData([...products])
  },[products])

  useEffect(()=>{
    const sortProducts = (sortBy)=> {
      if (sortBy == 'name'){
        const sorted = [...products].sort((a, b) => {
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
      }
      else if (sortBy == 'price'){
        const sorted = [...products].sort((a,b)=>a.price - b.price);
        setData(sorted);
      }  
      else if (sortBy == 'createdAt'){
        const sorted = [...products].sort(function(a,b){
          return new Date(b.date) - new Date(a.date);
        });
      setData(sorted);
      }
    }
    sortProducts(sortBy)
  },[sortBy]);


  return (
    <>
      <Meta />
      <h1>Latest Products</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
              <label>Sort Products By:</label>
      
      <select name="name" onChange={(e) => setSortBy(e.target.value)}>
        <option value="name">Name</option>
        <option value="price">Price</option>
        <option value="createdAt">Date</option>
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
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  )
}

export default HomeScreen
