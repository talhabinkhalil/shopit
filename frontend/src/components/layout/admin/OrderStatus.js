import React, { useEffect, useState } from 'react'
import Metadata from '../products/Metadata'
import Sidebar from './Sidebar'
import { useSelector, useDispatch } from "react-redux"
import { gettingSingleOrderRequest, clearingAdminErrors } from "../../../store/admin"
import Error from "../products/Error"
import OrderItems from '../order/OrderItems'

const OrderStatus = ({ match }) => {
    const dispatch = useDispatch()
    const [ordStatus, setOrdStatus] = useState("")
    const { loading, order, error } = useSelector(state => state.admin)

    const [msg, setMsg] = useState("")
    // const {} = order
    const status = [
        "",
        'Processing',
        "Shipped",
        "Delivered"
    ]
    const onChange = (e) => {
        setOrdStatus(e.target.value)
    }
    useEffect(() => {
        dispatch(gettingSingleOrderRequest(match.params.id))

        return () => {
            dispatch(clearingAdminErrors())
        }
    }, [dispatch, match])

    const { shippingInfo, paymentInfo, orderStatus, orderItems, user } = order || {}
    return (
        <>
            <Metadata title="Order Detail" />
            <div className="row">
                <div className="col-12 col-md-3 bg-dark" style={{ marginTop: "-1rem" }}>
                    <Sidebar />
                </div>
                <div className="col-12 col-md-7">
                    {loading ? (<Error />) : (
                        <div className="container my-3" style={{ minHeight: "100vh" }}>
                            <div className="row">
                                <div className="col-8">
                                    <div className="h1">
                                        Order ID # {match && match.params.id}
                                    </div>
                                    <div>
                                        <h4>Shipping Info</h4>
                                        <div className="ml-5">
                                            <p><span className="font-weight-bold">Name: </span> {user && user.name}</p>
                                            <p><span className="font-weight-bold">Email: </span> {user && user.email}</p>
                                            <p><span className="font-weight-bold">Role: </span> {user && user.role}</p>
                                            <p><span className="font-weight-bold">Address: </span> {shippingInfo && shippingInfo.address}</p>
                                            <p><span className="font-weight-bold">City: </span> {shippingInfo && shippingInfo.city}</p>
                                            <p><span className="font-weight-bold">Country: </span> {shippingInfo && shippingInfo.country}</p>
                                            <p><span className="font-weight-bold">Contact: </span> {shippingInfo && shippingInfo.phone}</p>
                                            <hr />
                                        </div>
                                    </div>
                                    <div className="my-3">
                                        <h4>Payment</h4>
                                        <div className="ml-5">
                                            {paymentInfo && paymentInfo.status === "succeeded" ? (
                                                <span className="text-success">
                                                    PAID
                                                </span>
                                            ) : (
                                                <span className="text-danger">
                                                    NOT PAID
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="my-3">
                                        <h4>Stripe ID</h4>
                                        <div className="ml-5">
                                            {paymentInfo && paymentInfo.id}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="my-3">
                                        <h4>Order Status</h4>
                                        <div className="ml-5">
                                            {orderStatus && orderStatus === "Delivered" ? (
                                                <span className="text-success">{orderStatus}</span>
                                            ) : (
                                                <span className="text-danger">{orderStatus}</span>
                                            )}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="my-3">
                                        <h4>Order Items</h4>
                                        <div className="ml-5 row">
                                            {orderItems && orderItems.map(item => (
                                                <OrderItems
                                                    key={item._id}
                                                    name={item.name}
                                                    price={item.price}
                                                    qty={item.qty}
                                                    url={item.images[0].url}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <label htmlFor="status" className="h5">Order Status</label>
                                        <select
                                            id="status"
                                            name="status"
                                            className="form-control"
                                            onChange={onChange}
                                            value={ordStatus}
                                            type="text"
                                        >
                                            {status.map(status => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                >{status}</option>
                                            ))}

                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <div className="btn btn-primary btn-block my-2">
                                            Submit
                                    </div>
                                    </div>
                                    <div>
                                        <img src={user && user.avatar.url} width="80%" height="80%" style={{ borderRadius: "50%" }} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default OrderStatus
