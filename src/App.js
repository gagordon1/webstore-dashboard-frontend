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

function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

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
      {orders.map(order =>
        <OrderTile
          key={order.id}
          order={order}
          setLoading={setLoading}
          updateOrders={updateOrders}
      />)}

    </AppContainer>
  );
}

export default App;
