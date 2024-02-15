import { useEffect, useState } from "react"
import { UserPreview } from "../cmps/UserPreview"
import { userService } from "../services/user.service"
import { List } from "../cmps/List"
import { UserMenu } from "../cmps/UserMenu"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"

export function UserIndex() {
    const [users, setUsers] = useState()
    const [userMenu, setUserMenu] = useState(undefined) //add, user, undefined

    useEffect(() => {
        loadUsers()
    }, [])
    
    async function loadUsers() {
        const users = await userService.query()
        setUsers(users)
    }

    async function onRemoveUser(userId) {
      try {
        await userService.remove(userId)
        console.log('Deleted Succesfully!')
        setUsers(prevUsers => prevUsers.filter((user) => user._id !== userId))
        showSuccessMsg('user removed')
      } catch (err) {
        console.log('Error from onRemoveUser ->', err)
        showErrorMsg('Cannot remove user')
      }
    }
  
    async function onAddUser(user) {
      try {
        const savedUser = await userService.save(user)
        console.log('Added User', savedUser)
        setUsers(prevUsers => [...prevUsers, savedUser])
        showSuccessMsg('User added')
      } catch (err) {
        console.log('Error from onAddUser ->', err)
        showErrorMsg('Cannot add user')
      }
    }
  
    async function onEditUser(user) {
      try {
        const savedUser = await userService.save(user)
        console.log('Updated user:', savedUser)
        setUsers(prevUsers => prevUsers.map((currUser) =>
          currUser._id === savedUser._id ? savedUser : currUser
        ))
        showSuccessMsg('User updated')
      } catch (err) {
        console.log('Error from onEditUug ->', err)
        showErrorMsg('Cannot update uug')
      }
    }

    if(!users) return <></>
    const onSaveUser = userMenu === 'add' ? onAddUser : onEditUser
    return (
      <main className="main-layout">
        <h2>Users</h2>
        <main>
          <button onClick={() => setUserMenu('add')}>Add User ⛐</button>
          <List items={users} itemType={'user'} ItemPreview={UserPreview} onRemoveItem={onRemoveUser} onEditItem={setUserMenu} />
        </main>
        {userMenu && <UserMenu userToEdit={userMenu} onSaveUser={onSaveUser} onSetDisplay={setUserMenu}/>}
      </main>
    )
}