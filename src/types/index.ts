export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  category_id?: number | null
  image: string
  rating: {
    rate: number
    count: number
  }
  created_at?: string | null
}

export interface CartItem extends Product {
  quantity: number
}

export interface ProductFormData {
  title: string
  price: number
  description: string
  category: string
  image: string
}

export interface Category {
  id: number
  name: string
}
