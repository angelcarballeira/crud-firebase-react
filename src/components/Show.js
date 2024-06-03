import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { collection, getDocs, getDoc, deleteDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Show = () => {
  //1 - configurar hooks
  const [products, setProducts] = useState([]);

  //2 - referenciamos a la db firestore
  const productsCollection = collection(db, 'products');

  //3 - función para mostrar todos los docs
  const getProducts = async () => {
    const data = await getDocs(productsCollection);
    setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    console.log(products);
  };

  //4 - función para eliminar un doc
  const deleteProduct = async (id) => {
    const productDoc = doc(db, 'products', id);
    await deleteDoc(productDoc);
    getProducts();
  };

  //5 - función de confirmación de sweetalert
  const confirmDelete = (id) => {
    MySwal.fire({
      title: '¿Estas seguro?',
      text: 'Esto no se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(id);
        MySwal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
      }
    });
  };

  //6 - usamos useEffect
  useEffect(() => {
    getProducts();
    // eslint-disable-next-line
  }, []);

  //7 - devolvemos vista de nuestro componente

  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col'>
            <div className='d-grid gap-2 '>
              <Link to='/create' className='btn btn-secondary mt-2 mb-2'>
                Crear
              </Link>
            </div>
            <table className='table table-hover table-dark'>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.description}</td>
                    <td>{product.stock}</td>
                    <td>
                      <Link
                        to={`/edit/${product.id}`}
                        className='btn btn-light m-1'
                      >
                        <i className='fa-regular fa-pen-to-square'></i>
                      </Link>

                      <button
                        onClick={() => confirmDelete(product.id)}
                        className='btn btn-danger'
                      >
                        <i className='fa-solid fa-trash'></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Show;
