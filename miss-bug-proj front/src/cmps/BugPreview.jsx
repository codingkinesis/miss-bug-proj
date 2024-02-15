

export function BugPreview({ children }) {
    const bug = children
    return <article >
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
    </article>
}