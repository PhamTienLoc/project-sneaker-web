import api from './api';

export const adminProductService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => {
    // Remove imageFile from data before sending
    const { imageFile, ...productData } = data;
    return api.post('/products', productData);
  },
  update: (id, data) => {
    // Remove imageFile from data before sending
    const { imageFile, ...productData } = data;
    return api.put(`/products/${id}`, productData);
  },
  delete: (id) => api.delete(`/products/${id}`),
  uploadImage: (productId, imageFile) => {
    // Check if user has ADMIN role
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Current user details:', {
      username: user?.username,
      roles: user?.roles,
      hasAdminRole: user?.roles?.includes('ROLE_ADMIN'),
      token: user?.token ? 'Token exists' : 'No token'
    });

    if (!user?.roles?.includes('ROLE_ADMIN')) {
      console.error('User does not have ROLE_ADMIN. Current roles:', user?.roles);
      throw new Error('Bạn cần quyền ADMIN để upload ảnh');
    }

    const formData = new FormData();
    formData.append("files", imageFile);
    formData.append("type", "product");
    formData.append("objectId", productId);
    
    // Log request details
    console.log('Upload Image Request Details:', {
      token: user?.token ? 'Token exists' : 'No token',
      user: {
        ...user,
        roles: user?.roles
      },
      formData: {
        type: 'product',
        objectId: productId,
        fileName: imageFile.name,
        fileSize: imageFile.size,
        fileType: imageFile.type
      }
    });

    return api.post("/images/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${user.token}`
      },
    });
  }
}; 