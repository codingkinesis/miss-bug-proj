
import { useEffect, useState } from 'react'

export function Filter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function onHandleChange({ target }) {
        let { name: field, value, type } = target
        switch (type) {
            case 'number':
            case 'range':
                value = (+value || '')
                break;
            case 'checkbox':
                var tags = [...filterByToEdit.tags]
                if(target.checked) tags.push(field)
                else tags = tags.filter(tag => tag !== field)
                field = 'tags'
                value = tags
            default:
                break;
        }
        setFilterByToEdit((prevFields) => ({ ...prevFields, [field]: value }))
    }

    function isChecked(selectedTag) {
        return filterByToEdit.tags.filter(tag => tag === selectedTag).length ? true : false
    }

    const { title, severity } = filterByToEdit
    return (
        <form className='filter'>
            <h3 className="head" >Filter</h3>
            <input className="search" type="text" name='title' placeholder='Search' value={title} onChange={onHandleChange}/>
            <div className="range">
                <p>Minimum Severity: </p>
                <input type="range" name='severity' min={0} max={5} value={severity || '0'} onChange={onHandleChange}/>
                <p>{severity || '0'}</p>
            </div>
            <div className="tag-options">
                    <p>Tags:</p>
                    <div className="tags">
                        <div>
                            <input type="checkbox" id="filter-critical" name="critical" value="critical" checked={isChecked("critical") ? 'checked' : ''} onChange={onHandleChange}/>
                            <label htmlFor="filter-critical">critical</label>
                        </div>
                        <div>
                            <input type="checkbox" id="filter-need-cr" name="need-cr" value="need-cr" checked={isChecked("need-cr") ? 'checked' : ''} onChange={onHandleChange}/>
                            <label htmlFor="filter-need-cr">need-cr</label>
                        </div>
                        <div>
                            <input type="checkbox" id="filter-dev-branch" name="dev-branch" value="dev-branch" checked={isChecked("dev-branch") ? 'checked' : ''} onChange={onHandleChange}/>
                            <label htmlFor="filter-dev-branch">dev-branch</label>
                        </div>
                        <div>
                            <input type="checkbox" id="filter-html" name="html" value="html" checked={isChecked("html") ? 'checked' : ''} onChange={onHandleChange}/>
                            <label htmlFor="filter-html">html</label>
                        </div>
                        <div>
                            <input type="checkbox" id="filter-js" name="js" value="js" checked={isChecked("js") ? 'checked' : ''} onChange={onHandleChange}/>
                            <label htmlFor="filter-js">js</label>
                        </div>
                        <div>
                            <input type="checkbox" id="filter-css" name="css" value="css" checked={isChecked("css") ? 'checked' : ''} onChange={onHandleChange}/>
                            <label htmlFor="filter-css">css</label>
                        </div>
                    </div>
            </div>
            <div className="filter-sort-by">
                <label  htmlFor="filter-sort-by">Sort By:</label>
                <select name="sortBy" id="filter-sort-by" onChange={onHandleChange}>
                    <option value="createdAt">Created Date</option>
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                </select>
            </div>
            <div className="filter-sort-dir">
                <label htmlFor="filter-sort-dir">Sort By:</label>
                <select name="sortDir" id="filter-sort-dir" onChange={onHandleChange}>
                    <option value={1}>Order</option>
                    <option value={-1}>Reverse</option>
                </select>
            </div>
        </form>
    )
}