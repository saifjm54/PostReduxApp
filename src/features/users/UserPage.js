import { useSelector } from "react-redux"
import { selectUserById } from "./usersSlice"
import {  selectPostsByUser } from "../posts/postsSlice"
import { Link } from "react-router-dom/cjs/react-router-dom.min"

export const UserPage = ({ match }) => {
    const { userId } = match.params 

    const user = useSelector(selectUserById(userId))

    const postsForUser = useSelector(selectPostsByUser(userId))

    const postTitles = postsForUser.map(post => (
        <li key={post.id}>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li>
    ))

    return(
        <section>
            <h2>{user.name}</h2>
            <ul>{postTitles}</ul>
        </section>
    )
}