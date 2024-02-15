import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { List } from '../cmps/List.jsx'
import { useCallback, useRef, useState } from 'react'
import { useEffect } from 'react'
import { Filter } from '../cmps/Filter.jsx'
import { utilService } from '../services/util.service.js'
import { BugMenu } from '../cmps/BugMenu.jsx'
import { BugPreview } from '../cmps/BugPreview.jsx'


export function BugIndex() {
  const [bugs, setBugs] = useState()
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
  const [bugMenu, setBugMenu] = useState(undefined) //add, bug, undefined
  const debounceSetFilterBy = useCallback(utilService.debounce(onSetFilterBy, 500))

  useEffect(() => {
    loadBugs()
  }, [filterBy])

  function onSetFilterBy(filterEdit) {
    setFilterBy(prevFilterBy => ({...prevFilterBy, ...filterEdit}))
  }

  async function loadBugs() {
    const bugs = await bugService.query(filterBy)
    setBugs(bugs)
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      console.log('Deleted Succesfully!')
      setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
      showSuccessMsg('Bug removed')
    } catch (err) {
      console.log('Error from onRemoveBug ->', err)
      showErrorMsg('Cannot remove bug')
    }
  }

  async function onAddBug(bug) {
    try {
      const savedBug = await bugService.save(bug)
      console.log('Added Bug', savedBug)
      setBugs(prevBugs => [...prevBugs, savedBug])
      showSuccessMsg('Bug added')
    } catch (err) {
      console.log('Error from onAddBug ->', err)
      showErrorMsg('Cannot add bug')
    }
  }

  async function onEditBug(bug) {
    try {
      const savedBug = await bugService.save(bug)
      console.log('Updated Bug:', savedBug)
      setBugs(prevBugs => prevBugs.map((currBug) =>
        currBug._id === savedBug._id ? savedBug : currBug
      ))
      showSuccessMsg('Bug updated')
    } catch (err) {
      console.log('Error from onEditBug ->', err)
      showErrorMsg('Cannot update bug')
    }
  }

  if(!bugs) return <></>
  const onSaveBug = bugMenu === 'add' ? onAddBug : onEditBug
  return (
    <main className="main-layout">
      <h2>Bugs App</h2>
      <main>
        <Filter filterBy={filterBy} onSetFilterBy={debounceSetFilterBy} />
        <button onClick={() => setBugMenu('add')}>Add Bug ⛐</button>
        <List items={bugs} itemType={'bug'} ItemPreview={BugPreview} onRemoveItem={onRemoveBug} onEditItem={setBugMenu} />
      </main>
      {bugMenu && <BugMenu bugToEdit={bugMenu} onSaveBug={onSaveBug} onSetDisplay={setBugMenu}/>}
    </main>
  )
}
