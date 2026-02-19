// api/supabaseProducts.ts
import type { Product, ProductFormData } from '@/types'
import { supabase } from '@/lib/supabase'

const normalize = (row: any): Product => {
  const categoryName =
    row.categories && row.categories.length ? row.categories[0].name : (row.category ?? '')

  return {
    id: row.id,
    title: row.title ?? '',
    //приводим к number
    price: typeof row.price === 'string' ? parseFloat(row.price) : (row.price ?? 0),
    description: row.description ?? '',
    category: row.categories?.name || '',
    category_id: row.category_id ?? null,
    image: row.image ?? '',
    rating: row.rating ?? { rate: 0, count: 0 },
    created_at: row.created_at ?? null,
  } as Product
}

// Получить все продукты
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*, categories(name)')

  if (error) throw error

  const rows = data ?? []
  return (rows as any[]).map(normalize)
}

// Получить список категорий
export const fetchCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase.from('categories').select('name')

  console.log('fetchCategories response', { data, error })

  if (error) {
    throw new Error(`Supabase error fetching categories: ${error.message}`)
  }

  if (!data || data.length === 0) {
    console.warn('No categories found')
    return []
  }

  const categories = data.map((r: any) => r.name ?? '')
  return Array.from(new Set(categories.filter(Boolean)))
}

const findOrCreateCategory = async (name?: string): Promise<number | null> => {
  if (!name) return null
  const { data: existing, error: errFind } = await supabase
    .from('categories')
    .select('id')
    .eq('name', name)
    .maybeSingle()

  if (errFind) throw errFind
  if (existing && (existing as any).id) return (existing as any).id

  const { data: inserted, error: errInsert } = await supabase
    .from('categories')
    .insert({ name })
    .select()
    .single()

  if (errInsert) throw errInsert
  return (inserted as any).id
}

export const uploadImage = async (file: File): Promise<string> => {
  const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/)
  const ext = extMatch ? extMatch[1] : 'jpg'
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
  const filePath = `products/${fileName}`
  console.log('filepath', filePath)

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file, { cacheControl: '3600', upsert: true, contentType: file.type })

  if (uploadError) throw uploadError
  const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath) as any
  return urlData.publicUrl
}

// Удалить файл из bucket 'images' по публичному URL или по пути
export const deleteImage = async (publicUrlOrPath: string): Promise<void> => {
  // если передали полный public URL — извлечём путь после /images/
  const pathMatch = publicUrlOrPath.match(/images\/(.*)$/)
  const path = pathMatch && pathMatch[1] ? pathMatch[1] : publicUrlOrPath
  const { error } = await supabase.storage.from('images').remove([path as string])
  if (error) throw error
}

// Создать продукт — если передана строка категории, найдём/создадим её в categories и запишем category_id
export const createProduct = async (payload: ProductFormData): Promise<Product> => {
  const categoryId = await findOrCreateCategory(payload.category)

  const row: any = {
    title: payload.title,
    price: payload.price,
    description: payload.description,
    image: payload.image,
    rating: { rate: 0, count: 0 },
  }

  if (categoryId) row.category_id = categoryId

  const { data, error } = await supabase
    .from('products')
    .insert([row])
    .select('*, categories(name)')
    .single()
  if (error) throw error
  return normalize(data)
}

// Обновить продукт
export const updateProduct = async (id: number, payload: ProductFormData): Promise<Product> => {
  const row: any = {
    title: payload.title,
    price: payload.price,
    description: payload.description,
    image: payload.image,
  }
  console.log(row)
  if (payload.category) {
    const categoryId = await findOrCreateCategory(payload.category)
    if (categoryId) row.category_id = categoryId
  }

  const { data, error } = await supabase
    .from('products')
    .update(row)
    .eq('id', id)
    .select('*, categories(name)')
    .single()
  if (error) throw error
  return normalize(data)
}

// Удалить продукт
export const deleteProduct = async (id: number): Promise<void> => {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}
