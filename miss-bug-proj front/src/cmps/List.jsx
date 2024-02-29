
import { Link } from 'react-router-dom'
import { userService } from '../services/user.service'

export function List({ items, itemType, ItemPreview, onRemoveItem, onEditItem }) {
  const loggedinUser = userService.getLoggedinUser()

  function isOwnedByUser(item) {
    console.log(item)
    return loggedinUser?.isAdmin || item.owner._id === loggedinUser?._id
  }

  return (
    <ul className="list">
      {items.map((item) => (
        <li className="preview" key={item._id}>
          <ItemPreview>{item}</ItemPreview>
          {isOwnedByUser(item) && <div>
            <button onClick={() => {onRemoveItem(item._id)}}>x</button>
            <button onClick={() => {onEditItem(item)}}>Edit</button>
          </div>}
          <Link to={`/${itemType}/${item._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  )
}
