import { firestore, storage } from '@/firebase/clientApp'
import { Admin } from '@/interfaces/admins'
import { Order } from '@/interfaces/orders'
import { Product } from '@/interfaces/products'
import bcrypt from 'bcryptjs' // For bcryptjs
import {
  addDoc,
  collection,
  doc,
  endAt,
  getDoc,
  getDocs,
  orderBy,
  query,
  startAt,
  updateDoc,
  where,
} from 'firebase/firestore'
import { deleteObject, getDownloadURL, listAll, ref } from 'firebase/storage'
import { toast } from 'react-toastify'

export const truncateText = (text: string, maxLength: number = 80) => {
  if (text.length <= maxLength) {
    return text
  }
  return text.substr(0, maxLength) + '...'
}

export const hashText = async (text: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)

  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

  return hashHex
}

export const hashPass = (text: string) => {
  return bcrypt.hash(text, 10).then((hash: string) => {
    return hash
  })
}

export const comparePass = (text: string, hash: string) => {
  return bcrypt.compare(text, hash).then((result: boolean) => {
    return result
  })
}

export const countFirestoreProducts = async () => {
  const coll = collection(firestore, 'products')
  const q = query(coll)
  const querySnapshot: any = await getDocs(q)
  return querySnapshot.size
}

export const countFirestoreOrders = async () => {
  const coll = collection(firestore, 'orders')
  const q = query(coll)
  const querySnapshot: any = await getDocs(q)
  return querySnapshot.size
}

export const countFirestoreUsers = async () => {
  const coll = collection(firestore, 'users')
  const q = query(coll)
  const querySnapshot: any = await getDocs(q)
  return querySnapshot.size
}

export const fetchProducts = async (
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
) => {
  try {
    const products: Product[] = []

    await getDocs(collection(firestore, 'products'))
      .then(async (querySnapshot: { docs: any }) => {
        for (const doc of querySnapshot.docs) {
          const productData = doc.data()

          // Fetch product image from storage
          const storageRef = ref(storage, `products/${doc.id}`)
          const imageUrl = await getDownloadURL(storageRef)

          // Create product object with image URL
          const product: Product = {
            ...productData,
            id: doc.id,
            image: imageUrl,
            // Add other product properties as needed
          }

          products.push(product)
        }
        setProducts(products)
      })
      .catch((error) => {
        toast.error('حدث خطأ ما ، يرجى إعادة تحميل الصفحة')
      })
  } catch (error) {
    toast.error('حدث خطأ ما، يرجى المحاولة مرة أخرى')
  }
}

export const fetchProduct = async (
  id: string,
  setProduct: React.Dispatch<React.SetStateAction<Product>>
) => {
  try {
    // Get the reference to the specific product document
    const productDocRef = doc(collection(firestore, 'products'), id)
    // Get the product document
    const productDoc = await getDoc(productDocRef)

    if (productDoc.exists()) {
      const productData = productDoc.data()

      // Fetch product image from storage
      const storageRef = ref(storage, `products/${id}`)
      const imageUrl = await getDownloadURL(storageRef)

      // Create product object with image URL
      const product = {
        ...productData,
        id: productDoc.id,
        image: imageUrl,
        // Add other product properties as needed
      } as Product

      setProduct(product)
    }
  } catch (error) {
    toast.error('حدث خطأ ما، يرجى المحاولة مرة أخرى')
  }
}

export const fetchOrders = async (
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
) => {
  try {
    await getDocs(collection(firestore, 'orders'))
      .then((querySnapshot: { docs: any }) => {
        const newData = querySnapshot.docs.map((doc: any) => {
          return {
            ...doc.data(),
            id: doc.id,
          }
        })
        setOrders(newData)
      })
      .catch((error) => {
        toast.error('حدث خطأ ما ، يرجى إعادة تحميل الصفحة')
      })
  } catch (error) {
    toast.error('حدث خطأ ما، يرجى المحاولة مرة أخرى')
  }
}

export const fetchOrder = async (
  id: string,
  setOrder: React.Dispatch<React.SetStateAction<Order>>
) => {
  try {
    // Get the reference to the specific order document
    const orderDocRef = doc(collection(firestore, 'orders'), id)
    // Get the order document
    const orderDoc = await getDoc(orderDocRef)

    if (orderDoc.exists()) {
      const orderData = orderDoc.data()

      // Create order object
      const order = {
        ...orderData,
        id: orderDoc.id,
        // Add other order properties as needed
      } as Order

      setOrder(order)
    }
  } catch (error) {
    toast.error('حدث خطأ ما، يرجى المحاولة مرة أخرى')
  }
}

export const fetchAdmins1 = async (
  setAdmins: React.Dispatch<React.SetStateAction<Admin[]>>
) => {
  try {
    await getDocs(collection(firestore, 'admins'))
      .then((querySnapshot: { docs: any }) => {
        const newData = querySnapshot.docs.map(async (document: any) => {
          // retreive admins id from the documentument and get the user data from the users collection
          // Get the reference to the specific order documentument
          const admin = document.data()
          const adminDocRef = doc(collection(firestore, 'users'), admin.adminId)
          // Get the admin document
          const adminDoc = await getDoc(adminDocRef)
          const adminData = adminDoc.data()
          return {
            email: adminData?.email || '',
            name: adminData?.username || '',
            id: document.id,
            adminId: adminDoc.id,
          }
        })
        Promise.all(newData).then((data) => {
          setAdmins(data)
        })
      })
      .catch((error) => {
        toast.error('حدث خطأ ما ، يرجى إعادة تحميل الصفحة')
      })
  } catch (error) {
    toast.error('حدث خطأ ما، يرجى المحاولة مرة أخرى')
  }
}

export const fetchAdmins = async (
  setAdmins: React.Dispatch<React.SetStateAction<Admin[]>>
) => {
  // fetch users with role: admin
  const q = query(collection(firestore, 'users'), where('role', '==', 'admin'))
  const querySnapshot = await getDocs(q)
  const admins = querySnapshot.docs.map((doc) => {
    return {
      name: doc.data().username,
      email: doc.data().email,
      role: doc.data().role,
      id: doc.id,
    }
  })
  setAdmins(admins)
}

export const newAdmin = async (id: string) => {
  // add role: admin to user document
  const userDocRef = doc(collection(firestore, 'users'), id)
  await updateDoc(userDocRef, {
    role: 'admin',
  })
}

export const addDocument = async (
  collectionName: string,
  data: any,
  callback: () => void
) => {
  try {
    const coll = collection(firestore, collectionName)
    const docRef = await addDoc(coll, data).then((docRef) => {
      callback()
      return docRef
    })

    return docRef.id
  } catch (error) {
    console.log('add document error: ', error)
    toast.error('حدث خطأ ما، يرجى المحاولة مرة أخرى')
  }
}

export const deleteProductImage = async (name: string) => {
  const storageRef = ref(storage, `products/${name}`)
  // Delete the image from Firebase Storage
  await deleteObject(storageRef)
}

export const getMonths = () => {
  const labels = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ] as string[]

  // create new labels array called newLabels that starts from the current month + 1 of past year and ends at the current month of this year
  const currentMonth = new Date().getMonth()
  const months = []

  for (let i = currentMonth + 1; i <= currentMonth + 12; i++) {
    months.push(labels[i % 12])
  }

  return months
}

// get number of products added each month
export const getProductsAddedInEachMonth = async () => {
  const months = getMonths()
  const coll = collection(firestore, 'products')
  const q = query(coll)
  const querySnapshot: any = await getDocs(q)
  const products = querySnapshot.docs.map((doc: any) => {
    return {
      ...doc.data(),
      id: doc.id,
    }
  })
  const productsAddedInEachMonth = months.map((month) => {
    const productsAddedInMonth = products.filter((product: any) => {
      if (!product.date) return 0
      const date = new Date(product.date.seconds * 1000)
      return date.toLocaleString('ar-EG', { month: 'long' }) === month
    })
    return productsAddedInMonth.length
  })
  return productsAddedInEachMonth
}

// get number of orders added each month
export const getOrdersAddedInEachMonth = async () => {
  const months = getMonths()
  const coll = collection(firestore, 'orders')
  const q = query(coll)
  const querySnapshot: any = await getDocs(q)
  const orders = querySnapshot.docs.map((doc: any) => {
    return {
      ...doc.data(),
      id: doc.id,
    }
  })
  const ordersAddedInEachMonth = months.map((month) => {
    const ordersAddedInMonth = orders.filter((order: any) => {
      if (!order.order_date) return 0
      const date = new Date(order.order_date.seconds * 1000)
      return date.toLocaleString('ar-EG', { month: 'long' }) === month
    })
    return ordersAddedInMonth.length
  })
  return ordersAddedInEachMonth
}

// get the number of users added each month
export const getUsersAddedInEachMonth = async () => {
  const months = getMonths()
  const coll = collection(firestore, 'users')
  const q = query(coll)
  const querySnapshot: any = await getDocs(q)
  const users = querySnapshot.docs.map((doc: any) => {
    return {
      ...doc.data(),
      id: doc.id,
    }
  })
  const usersAddedInEachMonth = months.map((month) => {
    const usersAddedInMonth = users.filter((user: any) => {
      if (!user.date) return 0
      const date = new Date(user.date.seconds * 1000)
      return date.toLocaleString('ar-EG', { month: 'long' }) === month
    })
    return usersAddedInMonth.length
  })
  return usersAddedInEachMonth
}

export const displayDateAndTime = (seconds: number) => {
  const date = new Date(seconds * 1000).toLocaleDateString('ar', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const time = new Date(seconds * 1000).toLocaleTimeString('ar', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return `${date} - ${time}`
}

export const searchUsersByEmail = async (email: string) => {
  const coll = collection(firestore, 'users')

  // query is if email is equal to the email we are searching for contains the email we are searching for
  const q = query(
    coll,
    orderBy('email'),
    startAt(email),
    endAt(email + '\uf8ff')
  )

  const querySnapshot: any = await getDocs(q)
  const users = querySnapshot.docs.map((doc: any) => {
    return {
      ...doc.data(),
      id: doc.id,
    }
  })
  return users
}

export const getUserIdAndRole = async (email: string) => {
  const coll = collection(firestore, 'users')
  console.log('email: ', email)
  // query is if email is equal to the email we are searching for contains the email we are searching for
  const q = query(coll, where('email', '==', email))

  const querySnapshot: any = await getDocs(q)
  const users = querySnapshot.docs.map((doc: any) => {
    return {
      ...doc.data(),
      id: doc.id,
    }
  })
  return users[0]
}

// Write a function that changes the points of each user by +-points
export const changePoints = async (email: string, points: number) => {
  const coll = collection(firestore, 'users')
  const q = query(coll, where('email', '==', email))
  const querySnapshot: any = await getDocs(q)
  const user = querySnapshot.docs[0].data()
  const userDocRef = doc(collection(firestore, 'users'), user.id)
  await updateDoc(userDocRef, {
    points: user.points + points,
  })
}

