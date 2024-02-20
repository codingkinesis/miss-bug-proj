import { useEffect, useRef, useState } from "react"
import { bugService } from '../services/bug.service.js' // local

export function BugMenu({bugToEdit, onSaveBug, onSetDisplay}) {
    const modalRef = useRef()
    const [bug, setBug] = useState(bugToEdit === 'add' ? bugService.getDefaultBug() : {...bugToEdit})

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
                var tags = [...bug.tags]
                if(target.checked) tags.push(field)
                else tags.filter(tag => tag === field)
                field = 'tags'
                value = tags
            default:
                break;
        }
        setBug((prevFields) => ({ ...prevFields, [field]: value }))
    }

    function isChecked(selectedTag) {
        return bug.tags.filter(tag => tag === selectedTag).length? true : false
    }

    if (!bug) return <></>
    return (
        <div className='full-screen-menu'>
            <form ref={modalRef} className='menu' onSubmit={(ev) => {(ev).preventDefault; onSaveBug(bug); onSetDisplay(undefined)}}>
                <input type="text" name='title' placeholder='Title' value={bug.title} onChange={onHandleChange} required/>
                <input type="text" name='description' placeholder='Description' value={bug.description} onChange={onHandleChange}/>
                <div className='range'>
                    <p>Severity: </p>
                    <input type="range" min={0} max={5} name="severity" value={bug.severity} onChange={onHandleChange}/>
                    <p>{bug.severity}</p>
                </div>
                <div className="tag-options">
                    <p>Tags:</p>
                    <div className="tags">
                        <div>
                            <input type="checkbox" id="critical" name="critical" value="critical" checked={isChecked("critical") ? 'checked' : ''} onChange={onHandleChange}/>
                            <label htmlFor="critical">critical</label>
                        </div>
                        <div>
                            <input type="checkbox" id="need-cr" name="need-cr" value="need-cr" checked={isChecked("need-cr") ? 'checked' : ''} onChange={onHandleChange}/>
                            <label htmlFor="need-cr">need-cr</label>
                        </div>
                        <div>
                            <input type="checkbox" id="dev-branch" name="dev-branch" value="dev-branch" checked={isChecked("dev-branch") ? 'checked' : ''} onChange={onHandleChange}/>
                            <label htmlFor="dev-branch">dev-branch</label>
                        </div>
                        <div>
                            <input type="checkbox" id="html" name="html" value="html" checked={isChecked("html") ? 'checked' : ''} onChange={onHandleChange}/>
                            <label htmlFor="html">html</label>
                        </div>
                        <div>
                            <input type="checkbox" id="js" name="js" value="js" checked={isChecked("js") ? 'checked' : ''} onChange={onHandleChange}/>
                            <label htmlFor="js">js</label>
                        </div>
                        <div>
                            <input type="checkbox" id="css" name="css" value="css" checked={isChecked("css") ? 'checked' : ''} onChange={onHandleChange}/>
                            <label htmlFor="css">css</label>
                        </div>
                    </div>
                </div>
                <button>Submit</button>
                <button className="btn-cancel" onClick={(ev) => {(ev).stopPropagation(); onSetDisplay(undefined)}}>Cancel</button>
            </form>
        </div>
    )
}