export interface Album {
  id: number
  title: string
  artist: string
  price: number
  image_url: string
}

export interface CartItem {
  album: Album
  addedAt: Date
}
