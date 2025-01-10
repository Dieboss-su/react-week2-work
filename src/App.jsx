import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 CSS
// import.meta.env.VITE_BASE_URL;
// import.meta.env.VITE_BASE_PATH;
const api = import.meta.env.VITE_BASE_URL;
const path = import.meta.env.VITE_BASE_PATH;

function App() {
  const [tempProduct, setTempProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [isAuth,setIsAuth] = useState(false)
  const[account,setAccount] = useState({
    "username": "",
    "password": ""
  });
  const handleAccount = (e)=>{
    const {value,name} = e.target;
    setAccount({
      ...account,
      [name]:value});
  };
  const handleLogin = async (e) =>{
    e.preventDefault()
    try{
      const response = await axios.post(`${api}/v2/admin/signin`,account);
      document.cookie = `dieboss=${response.data.token}; expires=${new Date(response.data.expired)}`;
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)dieboss\s*\=\s*([^;]*).*$)|^.*$/,
        "$1")
      setIsAuth(true)
      getProducts(token)
    }catch(error){
      console.log(error);
    }
  };
  const getProducts = async (token)=>{
    try{
      const products = await axios.get(`${api}/v2/api/${path}/admin/products`,{
        headers:{Authorization:token}
      })
      setProducts([...products.data.products])
    }catch(error){
      console.log(error);
    }
  }
  return (
    <>
    {isAuth ? 
        <div className="container py-5">
          <div className="row">
            <div className="col-6">
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <th scope="row">{product.title}</th>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>{product.is_enabled}</td>
                      <td>
                        <button
                          onClick={() => setTempProduct(product)}
                          className="btn btn-primary"
                          type="button"
                        >
                          查看細節
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-6">
              <h2>單一產品細節</h2>
              {tempProduct.title ? (
                <div className="card">
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top img-fluid"
                    alt={tempProduct.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {tempProduct.title}
                      <span className="badge text-bg-primary">
                        {tempProduct.category}
                      </span>
                    </h5>
                    <p className="card-text">商品描述：{tempProduct.description}</p>
                    <p className="card-text">商品內容：{tempProduct.content}</p>
                    <p className="card-text">
                      <del>{tempProduct.origin_price} 元</del> / {tempProduct.price}{" "}
                      元
                    </p>
                    <h5 className="card-title">更多圖片：</h5>
                    <div className="row">
                    {tempProduct.imagesUrl?.map((image) => (image && (<div className="col-6"><img style={ {objectFit: 'cover',height:'100%'}} key={image} src={image} className="img-fluid" /></div>)))}
                    </div>
                  </div>
                </div>
              ) : (
                <p>請選擇一個商品查看</p>
              )}
            </div>
          </div>
        </div>   
    : 
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">請先登入</h1>
        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <div className="form-floating mb-3">
          <input onChange={handleAccount} name='username' type="email" className="form-control" id="username" placeholder="name@example.com" />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input onChange={handleAccount} name='password' type="password" className="form-control" id="password" placeholder="Password" />
          <label htmlFor="password">Password</label>
        </div>
          <button className="btn btn-primary">登入</button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>}
    </>
  )
}

export default App
