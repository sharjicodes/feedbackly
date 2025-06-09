import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const API_BASE = "https://feedbackly-backend.onrender.com";
const API = `${API_BASE}/api`;

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [commentContent, setCommentContent] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const navigate = useNavigate();

  const toggleDark = () => setDarkMode(!darkMode);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleLogin = () => {
    setSignupOpen(false);
    setLoginOpen(!loginOpen);
  };
  const toggleSignup = () => {
    setLoginOpen(false);
    setSignupOpen(!signupOpen);
  };
  const togglePostForm = () => setShowPostForm(!showPostForm);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

useEffect(() => {
  fetch(`${API}/posts`)
    .then(async (res) => {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (!Array.isArray(data)) throw new Error("Expected array");
        console.log("Received posts:", data);
        setPosts(data.map((post) => ({
          ...post,
          comments: post.comments || [],
        })));
      } catch (err) {
        console.error("Error parsing posts response:", err);
      }
    })
    .catch(console.error);
}, []);


  useEffect(() => {
    fetch(`${API}/posts`)
      .then((res) => res.json())
      .then((data) =>
        setPosts(data.map((post) => ({ ...post, comments: post.comments || [] })))
      )
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, [token]);

  const handleSignup = async () => {
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful, please log in.");
        toggleSignup();
        toggleLogin();
      } else alert(data.message);
    } catch (err) {
      alert("Signup error");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.reload();
      } else alert(data.message);
    } catch (err) {
      alert("Login error");
    }
  };

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const res = await fetch(`${API}/posts`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setPosts([{ ...data, comments: [] }, ...posts]);
        setContent("");
        setImage(null);
        setShowPostForm(false);
      } else {
        alert(data.message || "Post failed");
      }
    } catch (err) {
      alert("Post error");
      console.error(err);
    }
  };

  const handleComment = async (postId) => {
    try {
      const res = await fetch(`${API}/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ content: commentContent[postId] }),
      });

      const data = await res.json();
      if (res.ok) {
        const newComment = data.comment || data;
        setCommentContent({ ...commentContent, [postId]: "" });
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? { ...post, comments: [...(post.comments || []), newComment] }
              : post
          )
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Comment error");
      console.error(err);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <header className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="text-xl font-bold">feedbackly.me</div>
          <div className="hidden md:flex gap-4 items-center">
            {isLoggedIn ? (
              <>
                <button onClick={() => navigate("/dashboard")} className="px-4 py-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">Dashboard</button>
                <button onClick={logout} className="px-4 py-1 bg-red-500 text-white rounded-full hover:bg-red-600">Logout</button>
              </>
            ) : (
              <button onClick={toggleLogin} className="px-4 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">Login</button>
            )}
            <button onClick={toggleDark} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </header>

        {menuOpen && (
          <div className="md:hidden px-4 py-3 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Dashboard</button>
                <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
              </>
            ) : (
              <button onClick={toggleLogin} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</button>
            )}
            <button onClick={toggleDark} className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800">Toggle Theme</button>
          </div>
        )}

        <section className="text-center px-6 py-12 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">Drop your thoughts. Get instant feedback.</h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">Share an idea or design and receive anonymous comments from the community.</p>
          <button onClick={togglePostForm} className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:scale-105 transition">Post Something</button>
        </section>

        {showPostForm && (
          <div className="max-w-xl mx-auto px-4 mb-10">
            <div className="border p-4 rounded-xl bg-white dark:bg-gray-800 shadow">
              <textarea
                rows="3"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thought..."
                className="w-full mb-3 p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
              />
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="mb-3 block w-full text-sm text-gray-500 dark:text-gray-300"
              />
              <button onClick={handlePost} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Post</button>
            </div>
          </div>
        )}

        <section className="px-4 max-w-2xl mx-auto grid gap-6 pb-12">
          {posts.map((post) => (
            <div key={post._id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-white dark:bg-gray-800 shadow-sm">
              <p className="text-lg mb-3">{post.content}</p>
              {post.image && (
                <img
                  src={post.image.startsWith("http") ? post.image : `${API_BASE}${post.image}`}
                  alt="post"
                  className="mb-3 rounded-lg"
                />
              )}
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Posted on {new Date(post.createdAt).toLocaleString()}
              </div>

              {/* Comments Section */}
              <div className="space-y-2">
                {(post.comments || []).map((comment, index) => (
                  <div key={index} className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded">
                    {comment.content}
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="mt-3">
                <textarea
                  rows="2"
                  placeholder="Leave a comment..."
                  value={commentContent[post._id] || ""}
                  onChange={(e) =>
                    setCommentContent({ ...commentContent, [post._id]: e.target.value })
                  }
                  className="w-full mb-2 p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={() => handleComment(post._id)}
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Comment
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Login Modal */}
        {loginOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4">Login</h2>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 mb-3 rounded border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 mb-3 rounded border"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
              <p className="text-sm mt-3">
                Don’t have an account?{" "}
                <button onClick={toggleSignup} className="text-blue-500 underline">Sign up</button>
              </p>
            </div>
          </div>
        )}

        {/* Signup Modal */}
        {signupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4">Sign Up</h2>
              <input
                type="text"
                placeholder="Name"
                className="w-full p-2 mb-3 rounded border"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 mb-3 rounded border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 mb-3 rounded border"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleSignup} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Sign Up</button>
              <p className="text-sm mt-3">
                Already have an account?{" "}
                <button onClick={toggleLogin} className="text-blue-500 underline">Login</button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
