import api from './api'

export const imageService = {
  // Get images by object type and ID
  getImagesByObject: (type, objectId) => {
    return api.get(`/images?type=${type}&objectId=${objectId}`)
  },

  // Get image download URL
  getImageUrl: (path) => {
    return `/api/images/download?path=${encodeURIComponent(path)}`
  },
}