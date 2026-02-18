<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { uploadImage } from '@/api'
import type { ProductFormData } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useProductsStore()

const isEdit = computed(() => !!route.params.id)
const pageTitle = computed(() => (isEdit.value ? 'Edit Product' : 'New Product'))

const form = ref<ProductFormData>({
  title: '',
  price: 0,
  description: '',
  category: '',
  image: '',
})

const errors = ref<Partial<Record<keyof ProductFormData, string>>>({})
const imagePreviewError = ref(false)

// file upload state
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isUploadingImage = ref(false)
const uploadError = ref<string | null>(null)

onMounted(async () => {
  if (store.products.length === 0) {
    await store.loadProducts()
  }

  if (isEdit.value) {
    const product = store.getProductById(Number(route.params.id))
    if (product) {
      form.value = {
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
      }
    } else {
      router.replace({ name: 'admin-products' })
    }
  }
})

const validate = (): boolean => {
  const newErrors: Partial<Record<keyof ProductFormData, string>> = {}

  if (!form.value.title.trim()) {
    newErrors.title = 'Title is required'
  }
  if (!form.value.price || form.value.price <= 0) {
    newErrors.price = 'Price must be greater than 0'
  }
  if (!form.value.description.trim()) {
    newErrors.description = 'Description is required'
  }
  if (!form.value.category.trim()) {
    newErrors.category = 'Category is required'
  }
  if (!form.value.image.trim()) {
    newErrors.image = 'Image URL is required'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files && input.files[0] ? input.files[0] : null
  uploadError.value = null

  // revoke previous preview if any
  if (previewUrl.value) {
    try {
      URL.revokeObjectURL(previewUrl.value)
    } catch (_) {}
    previewUrl.value = null
  }

  if (file) {
    const obj = URL.createObjectURL(file)
    previewUrl.value = obj
    ;(file as any).preview = obj
    selectedFile.value = file
    imagePreviewError.value = false
    form.value.image = obj
  } else {
    selectedFile.value = null
  }
}

const handleSubmit = async () => {
  if (!validate()) return

  try {
    // если выбран файл — загрузим в storage и заменим form.image на public url
    if (selectedFile.value) {
      isUploadingImage.value = true
      try {
        const publicUrl = await uploadImage(selectedFile.value)
        form.value.image = publicUrl

        // revoke local preview URL if present
        if (previewUrl.value) {
          try {
            URL.revokeObjectURL(previewUrl.value)
          } catch (_) {}
          previewUrl.value = null
        }

        selectedFile.value = null
      } catch (err: any) {
        uploadError.value = err?.message ?? String(err)
        isUploadingImage.value = false
        throw err
      } finally {
        isUploadingImage.value = false
      }
    }

    if (isEdit.value) {
      await store.updateProduct(Number(route.params.id), { ...form.value })
    } else {
      await store.addProduct({ ...form.value })
    }

    router.push({ name: 'admin-products' })
  } catch (err: any) {
    console.error('Save product error', err)
    alert('Ошибка при сохранении продукта: ' + (err?.message ?? err))
  }
}

const handleImageError = () => {
  imagePreviewError.value = true
}

const handleImageInput = () => {
  imagePreviewError.value = false
}

onBeforeUnmount(() => {
  if (previewUrl.value) {
    try {
      URL.revokeObjectURL(previewUrl.value)
    } catch (_) {}
    previewUrl.value = null
  }
})
</script>

<template>
  <div class="form-page">
    <div class="form-header">
      <button class="back-btn" @click="router.back()">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>
      <h1 class="form-title">{{ pageTitle }}</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="product-form">
      <div class="form-grid">
        <!-- Left: fields -->
        <div class="form-fields">
          <!-- Title -->
          <div class="field">
            <label class="field-label" for="title">Title</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              class="field-input"
              :class="{ 'field-input--error': errors.title }"
              placeholder="Product title"
            />
            <span v-if="errors.title" class="field-error">{{ errors.title }}</span>
          </div>

          <!-- Description -->
          <div class="field">
            <label class="field-label" for="desc">Description</label>
            <textarea
              id="desc"
              v-model="form.description"
              class="field-input field-textarea"
              :class="{ 'field-input--error': errors.description }"
              placeholder="Product description"
              rows="4"
            />
            <span v-if="errors.description" class="field-error">{{ errors.description }}</span>
          </div>

          <!-- Price + Category row -->
          <div class="field-row">
            <div class="field">
              <label class="field-label" for="price">Price ($)</label>
              <input
                id="price"
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                class="field-input"
                :class="{ 'field-input--error': errors.price }"
                placeholder="0.00"
              />
              <span v-if="errors.price" class="field-error">{{ errors.price }}</span>
            </div>

            <div class="field">
              <label class="field-label" for="category">Category</label>
              <select
                id="category"
                v-model="form.category"
                class="field-input field-select"
                :class="{ 'field-input--error': errors.category }"
              >
                <option value="" disabled>Select category</option>
                <option v-for="cat in store.categories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
              <span v-if="errors.category" class="field-error">{{ errors.category }}</span>
            </div>
          </div>

          <!-- Image URL -->
          <div class="field">
            <label class="field-label" for="image">Image URL</label>
            <input
              id="image"
              v-model="form.image"
              type="url"
              class="field-input"
              :class="{ 'field-input--error': errors.image }"
              placeholder="https://example.com/image.jpg"
              @input="handleImageInput"
            />
            <span v-if="errors.image" class="field-error">{{ errors.image }}</span>

            <!-- File upload (optional) -->
            <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px">
              <input type="file" accept="image/*" @change="handleFileChange" />
              <small v-if="selectedFile" style="color: var(--text-tertiary)"
                >Selected: {{ selectedFile.name }}</small
              >
              <small v-if="isUploadingImage" style="color: var(--text-tertiary)"
                >Uploading image…</small
              >
              <span v-if="uploadError" class="field-error">{{ uploadError }}</span>
            </div>
          </div>
        </div>

        <!-- Right: Image preview -->
        <div class="form-preview">
          <div class="preview-label">Preview</div>
          <div class="preview-card">
            <div v-if="form.image && !imagePreviewError" class="preview-image-wrapper">
              <img
                :src="form.image"
                alt="Product preview"
                class="preview-image"
                @error="handleImageError"
              />
            </div>
            <div v-else class="preview-placeholder">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>No image</span>
            </div>
            <div class="preview-info" v-if="form.title || form.price">
              <span class="preview-title">{{ form.title || 'Product title' }}</span>
              <span class="preview-price">${{ (form.price || 0).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="router.back()">Cancel</button>
        <button type="submit" class="btn-primary" :disabled="isUploadingImage">
          {{ isUploadingImage ? 'Uploading image…' : isEdit ? 'Save changes' : 'Create product' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 900px;
  animation: fadeInUp 0.4s ease-out;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.back-btn:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}

/* Form layout */
.product-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 28px;
  align-items: start;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Fields */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.field-input {
  padding: 10px 14px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: all var(--transition-fast);
  font-family: inherit;
}

.field-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-subtle);
}

.field-input--error {
  border-color: var(--danger);
}

.field-input--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.field-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

.field-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
  text-transform: capitalize;
}

.field-select option {
  background: var(--bg-surface);
  color: var(--text-primary);
  text-transform: capitalize;
}

.field-error {
  font-size: 12px;
  color: var(--danger);
}

/* Preview */
.form-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: sticky;
  top: 32px;
}

.preview-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.preview-card {
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.preview-image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: #ffffff;
  padding: 16px;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: var(--bg-elevated);
  color: var(--text-tertiary);
  gap: 8px;
}

.preview-placeholder span {
  font-size: 13px;
}

.preview-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-price {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

/* Actions */
.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid var(--border-default);
}

.btn-secondary {
  padding: 10px 20px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  transition: all var(--transition-fast);
}

.btn-secondary:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.btn-primary {
  padding: 10px 24px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  transition: background var(--transition-fast);
}

.btn-primary:hover {
  background: var(--accent-hover);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-preview {
    position: static;
    order: -1;
  }

  .field-row {
    grid-template-columns: 1fr;
  }
}
</style>
