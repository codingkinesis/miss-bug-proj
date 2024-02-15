
import { Link } from 'react-router-dom'

export function List({ items, itemType, ItemPreview, onRemoveItem, onEditItem }) {
  return (
    <ul className="list">
      {items.map((item) => (
        <li className="preview" key={item._id}>
          <ItemPreview>{item}</ItemPreview>
          <div>
            <button
              onClick={() => {
                onRemoveItem(item._id)
              }}
            >
              x
            </button>
            <button
              onClick={() => {
                onEditItem(item)
              }}
            >
              Edit
            </button>
          </div>
          <Link to={`/${itemType}/${item._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  )
}
