import { useEffect, useState } from "react"
import axios from "axios"
import { faEdit, faCirclePlus, faCircle, faGift, faMoneyBill, faMultiply, faClose, faBox, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const ShowOrders = () => {
  const fetchOrdersUrl = 'http://localhost:3000/order'
  const updateOrdersUrl = 'http://localhost:3000/order/'
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState({ products: [] })

  const [newProductsList, setNewProductsList] = useState([])
  const [newProductName, setNewProductName] = useState("")
  const [newProductUnitCost, setNewProductUnitCost] = useState(0.00)
  const [newProductAmount, setNewProductAmount] = useState(0.00)
  const [newOrderTotal, setNewOrderTotal] = useState(0.00)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchOrders();
  }, [searchTerm])

  const fetchOrders = async () => {
    const { data } = await axios.get(fetchOrdersUrl)
    setOrders(data.filter(order => order.id.toString().includes(searchTerm.toLowerCase())))
  }

  const udpateOrder = async () => {
    const { data } = await axios.put(updateOrdersUrl + selectedOrder.id, {
      total: parseFloat(newOrderTotal),
      products: newProductsList.map(p => {
        return {
          id: p.id,
          name: p.name,
          unitPrice: Number(p.unitPrice),
          qty: parseFloat(p.qty),
        }
      })
    })
  }

  const createOrder = async () => {
    const { data } = await axios.post(fetchOrdersUrl, {
      date: new Date(),
      total: parseFloat(newOrderTotal),
      products: newProductsList.map(p => {
        return {
          name: p.name,
          unitPrice: Number(p.unitPrice),
          qty: parseFloat(p.qty),
        }
      })
    })
  }

  const calculateNewTotal = (prodPrice, prodUnits) => {
    const newTotal = Number(newOrderTotal + parseFloat(prodPrice) * Number(prodUnits))
    setNewOrderTotal(newTotal)
  }

  const addNewProduct = ({ productName, productPrice, productAmount }) => {
    setNewProductsList((prev) => {
      calculateNewTotal(productPrice, productAmount)
      return [...prev, { id: prev.length - 1, name: productName, unitPrice: productPrice, qty: productAmount }]
    })
  }

  const initNewOrderModal = () => {
    setNewProductsList([])
    setNewProductName("")
    setNewProductUnitCost("")
    setNewProductAmount("")
    setNewOrderTotal(0.00)
  }

  const initEditOrder = (o) => {
    setSelectedOrder(o)
    setNewOrderTotal(o.total)
    setNewProductsList(o.products)
    setNewProductName("")
    setNewProductUnitCost("")
    setNewProductAmount("")
  }

  return (
    <div>
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-md-4 offset-4">
            <div className="d-grid mx-auto">
              <button onClick={() => { initNewOrderModal() }} className="btn btn-dark " data-bs-toggle="modal" data-bs-target='#modalNewOrder'>
                <div className="flex space-x-2 justify-center" >
                  <div>
                    <FontAwesomeIcon icon={faCirclePlus} />
                  </div>
                  <div>
                    <p className="mb-0">Create Order</p>
                  </div>
                </div>
              </button>
              <div className="input-group mt-10">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input type="text" id="nombre" className="form-control" placeholder="Search Order" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }}></input>

              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12 col-lg-8 offset-0 offset-lg-2">
              <div className="table-responsive">
                <table className="mt-10 table table-bordered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th className="text-center">DATE</th>
                      <th className="text-center">TOTAL ($)</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {
                      orders.map(o => {
                        return (
                          <tr key={o.id}>
                            <td>{o.id}</td>
                            <td className="text-center">{new Date(o.date).toLocaleDateString()}</td>
                            <td className="text-center">{parseFloat(o.total) ?? "0.00"}</td>
                            <td className="flex justify-center w-full items-center" onClick={() => { initEditOrder(o) }}>
                              <button data-bs-toggle="modal" data-bs-target='#modalEditOrder' className="btn btn-primary" onClick={() => { }}>
                                <i className="fa-solid fa-edit"></i>
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div id="modalNewOrder" className="modal fade">
          <div className="modal-dialog !min-w-[700px]" >
            <div className="modal-content">
              <div className="modal-header">
                <label className="h5">New Orden</label>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label='Close'></button>
              </div>
              <div className="modal-body">
                <p class>Agregar Producto</p>
                <div className="flex space-x-5 items-center">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faBox} />
                    </span>
                    <input type="text" id="name" className="form-control" placeholder="Product Name" value={newProductName} onChange={(e) => { setNewProductName(e.target.value) }}></input>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faMoneyBill} />
                    </span>
                    <input type="text" id="nombre" className="form-control" placeholder="Price ($)" value={newProductUnitCost} onChange={(e) => { setNewProductUnitCost(e.target.value) }}></input>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faMultiply} />
                    </span>
                    <input type="text" id="nombre" className="form-control" placeholder="QTY" value={newProductAmount} onChange={(e) => { setNewProductAmount(e.target.value) }}></input>
                  </div>
                  <FontAwesomeIcon icon={faCirclePlus} className="cursor-pointer btn btn-primary " onClick={() => { addNewProduct({ productName: newProductName, productPrice: newProductUnitCost, productAmount: newProductAmount }) }} />
                </div>
                {
                  newProductsList.length > 0 && (
                    <div>
                      <p className="mt-8">Productos</p>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th className="text-center">Description</th>
                            <th className="text-center">Price per unit ($)</th>
                            <th className="text-center">Units</th>
                          </tr>
                        </thead>
                        <tbody className="table-group-divider">
                          {
                            newProductsList.map((p, k) => {
                              return (
                                <tr key={k}>
                                  <td className="text-center">{p.name}</td>
                                  <td className="text-center">{p.unitPrice ?? 0.00}</td>
                                  <td className="text-center">{p.qty ?? 0}</td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  )
                }
              </div>
              <div className="modal-footer text-left">
                <p className="w-full text-left">Total: ${newOrderTotal} </p>
                <div className="d-grid mx-auto">
                  <button onClick={() => { createOrder() }} disabled={newProductsList.length === 0} className="btn btn-primary ">
                    <div className="flex space-x-2 justify-center" >
                      <div>
                        <p className="mb-0">Create Order</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="modalEditOrder" className="modal fade">
          <div className="modal-dialog !min-w-[700px]" >
            <div className="modal-content">
              <div className="modal-header">
                <label className="h5">Edit Order</label>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label='Close'></button>
              </div>
              <div className="modal-body">
                <p class>Add New Product</p>
                <div className="flex space-x-5 items-center">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faBox} />
                    </span>
                    <input type="text" id="nombre" className="form-control" placeholder="Product Name" value={newProductName} onChange={(e) => { setNewProductName(e.target.value) }}></input>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faMoneyBill} />
                    </span>
                    <input type="text" id="nombre" className="form-control" placeholder="Price ($)" value={newProductUnitCost} onChange={(e) => { setNewProductUnitCost(e.target.value) }}></input>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faMultiply} />
                    </span>
                    <input type="text" id="nombre" className="form-control" placeholder="QTY" value={newProductAmount} onChange={(e) => { setNewProductAmount(e.target.value) }}></input>
                  </div>
                  <FontAwesomeIcon icon={faCirclePlus} className="cursor-pointer btn btn-primary " onClick={() => { addNewProduct({ productName: newProductName, productPrice: newProductUnitCost, productAmount: newProductAmount }) }} />
                </div>
                {
                  newProductsList.length > 0 && (
                    <div>
                      <p className="mt-8">Products</p>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th className="text-center">Description</th>
                            <th className="text-center">Price per unit ($)</th>
                            <th className="text-center">Units</th>
                            <th className="text-center"></th>
                          </tr>
                        </thead>
                        <tbody className="table-group-divider">
                          {
                            newProductsList.map((p, k) => {
                              return (
                                <tr key={k}>
                                  <td className="text-center">{p.name}</td>
                                  <td className="text-center">{p.unitPrice ?? 0.00}</td>
                                  <td className="text-center">{p.qty ?? 0}</td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  )
                }
              </div>
              <div className="modal-footer text-left">
                <p className="w-full text-left">Total: ${newOrderTotal} </p>
                <div className="d-grid mx-auto">
                  <button onClick={() => { udpateOrder() }} disabled={newProductsList.length === 0} className="btn btn-primary ">
                    <div className="flex space-x-2 justify-center" >
                      <div>
                        <p className="mb-0">Update Order</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>)
} 