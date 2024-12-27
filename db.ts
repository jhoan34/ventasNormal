export const basededatos = {
    productos : [
        {
          id: '64a2b6f2b5e0b4001f6e4a1d',  // Este es un ejemplo de ObjectId generado automáticamente
          nombre: 'Laptop',
          precio: 3000000,
          costo: 2000000,
          stock: 10,
          urlImagen: 'https://via.placeholder.com/150'
        },
        {
          id: '64a2b6f2b5e0b4001f6e4a1e',
          nombre: 'Smartphone',
          precio: 1500000,
          costo: 1000000,
          stock: 20,
          urlImagen: 'https://via.placeholder.com/150'
        },
        {
          id: '64a2b6f2b5e0b4001f6e4a1f',
          nombre: 'Auriculares',
          precio: 200000,
          costo: 100000,
          stock: 50,
          urlImagen: 'https://via.placeholder.com/150'
        }
    ],
      
    ventas : [
        {
          id: '64a2b6f2b5e0b4001f6e4a20',
          productoId: '64a2b6f2b5e0b4001f6e4a1d',  // Relacionado con el id del producto "Laptop"
          cantidad: 2,
          monto: 6000000,
          ganancia: 2000000
        },
        {
          id: '64a2b6f2b5e0b4001f6e4a21',
          productoId: '64a2b6f2b5e0b4001f6e4a1e',  // Relacionado con el id del producto "Smartphone"
          cantidad: 3,
          monto: 4500000,
          ganancia: 1500000
        }
    ],
      
    gastos : [
        {
          id: '64a2b6f2b5e0b4001f6e4a22',
          monto: 500000,
          descripcion: 'Publicidad'
        },
        {
          id: '64a2b6f2b5e0b4001f6e4a23',
          monto: 300000,
          descripcion: 'Transporte'
        },
        {
          id: '64a2b6f2b5e0b4001f6e4a24',
          monto: 100000,
          descripcion: 'Papelería'
        }
    ]
      
};
