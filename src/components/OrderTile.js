import styled from 'styled-components';
import Button from './Button';
import { colors } from '../Theme';
import axios from 'axios';
import { CANCEL_ORDER_ENDPOINT, CONFIRM_ORDER_ENDPOINT } from '../endpoints'
import { useState, useEffect } from 'react';


const OrderDataItem = styled.p`
  margin-top: auto;
  margin-bottom: auto;
`
const ShippingDataContainer = styled.div`
  margin : auto;
  display : grid;
  grid-gap : 4px;
  grid-template-columns: 1fr;
  justify-items: start;

`
const StatusDataContainer = styled.div`
  margin : auto;
  display : grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr;
  justify-items: start;

`
const OrderIdContainer = styled.div`
  display : flex;
  background : black;
  width : 100px;
  height : 100%;
  border-radius: 7px 0px 0px 7px;
`
const OrderId = styled.h3`
  margin : auto;
  transform: rotate(-90deg);
  color : white;
  width : 100px;


`

const OrderTileContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height : 150px;
  width : 80%;
  margin : auto;
  margin-top:20px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  background: #${props => props.color}
`

const getColor = (props) =>{
  if (props.order.shipped){
    return colors.shipped;
  }
  else if (props.order.cancelled){
    return colors.cancelled;
  }
  else if (props.order.paymentComplete){
    return colors.paid;
  }

  else{
    return "FFFFFF"
  }
}

const calculateAmountPaid = (retail, shipping, taxRate) =>{
  return ((Number(retail) + Number(shipping)) * (1+ Number(taxRate)).toFixed(2))
}



export default function OrderTile (props) {



  const [color, setColor] = useState("FFFFFF")

  const cancelOrder = async (orderId) => {
    props.setLoading(true);
    try{
      let response = await axios.post(CANCEL_ORDER_ENDPOINT, {orderId : orderId})
      console.log(response);
    }
    catch(error){
      console.log(error);
    }
    finally{
      props.updateOrders();
      props.setLoading(false);
    }

  }

  const shipOrder = async (orderId) => {
    props.setLoading(true);
    try{
      let response = await axios.post(CONFIRM_ORDER_ENDPOINT, {orderId : orderId});
      console.log(response);
    }
    catch(error){
      console.log(error);
    }
    finally{
      props.updateOrders();
      props.setLoading(false);
    }

  }

  useEffect(() => {
    const col = getColor(props)
    setColor(col);
  }, [props, setColor]);


  const getEasternTime = (timestamp) => {
    return new Date(timestamp*1000).toLocaleString('en-US', {
    timeZone: 'America/New_York',
  });
  }
  return(
    <OrderTileContainer color={color}>
      <OrderIdContainer>
        <OrderId> {props.order.id}</OrderId>
      </OrderIdContainer>
      <StatusDataContainer>
        <OrderDataItem> Amount Received: ${calculateAmountPaid(props.order.retailPrice,
          props.order.customerShippingRate, props.order.customerTaxRate)} </OrderDataItem>
        <OrderDataItem> Owed to Printful: ${props.order.myCosts.total}</OrderDataItem>
      </StatusDataContainer>
      <ShippingDataContainer>
        <OrderDataItem> Name: {props.order.recipient.name} </OrderDataItem>
        <OrderDataItem> Email: {props.order.recipient.email}</OrderDataItem>
        <OrderDataItem> Address: {props.order.recipient.address} </OrderDataItem>
        <OrderDataItem> City: {props.order.recipient.city} </OrderDataItem>
        <OrderDataItem> State: {props.order.recipient.state}</OrderDataItem>
        <OrderDataItem> Country: {props.order.recipient.country}</OrderDataItem>
      </ShippingDataContainer>
      <StatusDataContainer>
        <OrderDataItem> Created: {getEasternTime(props.order.created)} ET</OrderDataItem>
        <OrderDataItem> Paid: {props.order.paymentComplete? "yes" : "no"}</OrderDataItem>
        <OrderDataItem> Shipped: {props.order.shipped? "yes" : "no"}</OrderDataItem>
        <OrderDataItem> Cancelled: {props.order.cancelled? "yes" : "no"}</OrderDataItem>
      </StatusDataContainer>
      <StatusDataContainer>
        <Button disabled={props.order.shipped || props.order.cancelled}
              onClick={() => cancelOrder(props.order.id)} title={"Cancel"}/>
        <Button disabled={props.order.cancelled || props.order.shipped}
              onClick={() => shipOrder(props.order.id)} title={"Fulfill"}/>
      </StatusDataContainer>
    </OrderTileContainer>
  )
}
