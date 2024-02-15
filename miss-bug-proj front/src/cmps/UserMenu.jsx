import { useEffect, useRef, useState } from "react"
import { userService } from "../services/user.service"

export function UserMenu({userToEdit, onSaveUser, onSetDisplay}) {
    const modalRef = useRef()
    const [user, setUser] = useState(userToEdit === 'add' ? userService.getDefaultUser() : {...userToEdit})

    useEffect(() => {
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside)
        }, 0)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    },[])

    function handleClickOutside(ev) {
        if (modalRef.current && !modalRef.current.contains(ev.target)) {
            ev.stopPropagation()
        }
    }

    function onHandleChange({ target }) {
        let { name: field, value, type } = target
        switch (type) {
            case 'number':
            case 'range':
                value = (+value || 0)
                break;
            case 'checkbox':
                var tags = [...user.tags]
                if(target.checked) tags.push(field)
                else tags.filter(tag => tag === field)
                field = 'tags'
                value = tags
            default:
                break;
        }
        setUser((prevFields) => ({ ...prevFields, [field]: value }))
    }

    function isChecked(selectedTag) {
        return user.tags.filter(tag => tag === selectedTag).length? true : false
    }

    if (!user) return <></>
    return (
        <div className='full-screen-menu'>
            <form ref={modalRef} className='menu' onSubmit={(ev) => {(ev).preventDefault; onSaveUser(user); onSetDisplay(undefined)}}>
                <input type="text" name='fullname' placeholder='Fullname' value={user.fullname} onChange={onHandleChange} required/>
                <input type="text" name='username' placeholder='Username' value={user.username} onChange={onHandleChange} required/>
                <input type="password" name='password' placeholder='Password' value={user.password} onChange={onHandleChange} required/>
                <button>Submit</button>
                <button className="btn-cancel" onClick={(ev) => {(ev).stopPropagation(); onSetDisplay(undefined)}}>Cancel</button>
            </form>
        </div>
    )
}