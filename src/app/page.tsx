import React, { useState, useEffect } from "react";
import axios from "axios";
import { DateTime } from "luxon";
import Post from "./Post"; // Assuming the Post component is already created
import Masonry from "react-masonry-css";
import { PostData } from "./types/postdata";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
    const [posts, setPosts] = useState<PostData[]>([]);

    const breakpointColumnsObj = {
        default: 6,
        1640: 5,
        1310: 4,
        980: 3,
        650: 2,
        320: 1,
    };

    useEffect(() => {
        // Fetch posts from the server
        axios
            .get<PostData[]>(`${API_URL}`)
            .then((res) => {
                // Reverse the posts array to display in reverse order
                setPosts(res.data.reverse());
            })
            .catch((err) => console.error(err));
    }, []);

    if (posts.length === 0)
        return <p className="posts-container">no new posts.</p>;
    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="posts-container"
            columnClassName="my-masonry-grid_column"
        >
            {posts.map((post) => (
                <Link to={`/post/${post.id}`} key={post.id}>
                    <Post
                        key={post.id}
                        author={post.username || "anonymous"}
                        date={
                            DateTime.fromISO(post.createdAt, { zone: "utc" })
                                .setZone(DateTime.now().zoneName)
                                .toRelative({ base: DateTime.now() }) ||
                            "just now"
                        }
                        content={post.content}
                        postNumber={post.id}
                    />
                </Link>
            ))}
        </Masonry>
    );
}

export default PostList;
