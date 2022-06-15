import OrderTile from './components/OrderTile';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { GET_ORDERS_ENDPOINT } from './endpoints';
import styled from 'styled-components';



const AppContainer = styled.div`
  display : grid;
  justify-content : space-evenly;
  grid-template-columns: 1fr;
  width:100%;
  text-align : center;

`

//ONLY WORKS WHEN BACKEND DEV SERVER RUNNING ON localhost:8080


const RefreshProductButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  margin : auto;
  width: 200px;
  height: 60px;
  background: #F4F4F4;
  border-radius: 7px;
  &:hover {
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  }
`

function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  async function refreshProducts(){
    setLoading(true)
    const response = await axios.get("http://localhost:8080/updateProducts")
    console.log(response);
    setLoading(false)
  }

  const updateOrders = async () =>{
    axios.get(GET_ORDERS_ENDPOINT)
    .then(r => {
      console.log(r);
      setOrders(r.data);
    });
  }

  useEffect(() => {
      updateOrders();
  }, [setOrders]);

  return (
    <AppContainer>
      {orders.length === 0? <h2> No orders. </h2> : null}
      {loading? <h2>Loading...</h2> : null}
      {orders.sort(function(a,b){return b.created-a.created})
        .map(order =>
        <OrderTile
          key={order.id}
          order={order}
          setLoading={setLoading}
          updateOrders={updateOrders}
      />)}
      <RefreshProductButton
        disabled={false}
        onClick={refreshProducts}
        >
        {"Refresh Products"}
      </RefreshProductButton>

    </AppContainer>
  );
}

export default App;
