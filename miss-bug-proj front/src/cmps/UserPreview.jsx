
export function UserPreview({ children }) {
    const user = children
    return <article >
        <h4>{user.username}</h4>
        <h1>🧑</h1>
        <p>fullname: <span>{user.fullname}</span></p>
    </article>
}