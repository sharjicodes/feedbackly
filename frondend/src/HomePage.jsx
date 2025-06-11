// HomePage.jsx
import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, Search } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API}/posts`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(data.map((post) => ({
            ...post,
            comments: Array.isArray(post.comments) ? post.comments : [],
          })));
          setLoadError(null);
        } else throw new Error("Expected array");
      } catch (err) {
        setLoadError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id);
      } catch {}
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
        alert("Signup successful. Please log in.");
        toggleSignup();
        toggleLogin();
      } else alert(data.message);
    } catch {
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
    } catch {
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
        headers: { Authorization: token ? `Bearer ${token}` : "" },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setPosts([{ ...data, comments: [] }, ...posts]);
        setContent(""); setImage(null); setShowPostForm(false);
      } else alert(data.message || "Post failed");
    } catch {
      alert("Post error");
    }
  };

  const handleComment = async (postId) => {
    if (!isLoggedIn) return alert("Please login to comment.");
    try {
      const res = await fetch(`${API}/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentContent[postId] }),
      });
      const data = await res.json();
      if (res.ok) {
        const newComment = data.comment || data;
        setCommentContent({ ...commentContent, [postId]: "" });
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId ? {
              ...post,
              comments: [...(post.comments || []), newComment]
            } : post
          )
        );
      } else alert(data.message);
    } catch {
      alert("Comment error");
    }
  };

  const getImageUrl = (post) => {
    if (post.imageUrl?.startsWith("http")) return post.imageUrl;
    if (post.image?.startsWith("http")) return post.image;
    return post.imageUrl ? `${API_BASE}${post.imageUrl}` :
           post.image ? `${API_BASE}${post.image}` : null;
  };

  const filteredPosts = posts.filter((post) =>
    post.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition duration-300">
        
        {/* Header */}
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

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-4 py-3 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Dashboard</button>
                <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
              </>
            ) : (
              <button onClick={toggleLogin} className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
            )}
            <button onClick={toggleDark} className="px-4 py-2 border rounded">Toggle Theme</button>
          </div>
        )}

       
        {/* Hero Section */}
        <section className="text-center px-6 py-12 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">Drop your thoughts. Get instant feedback.</h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">Share an idea or design and receive anonymous comments from the community.</p>
          <button
            onClick={() => {
              if (!isLoggedIn) alert("Please log in to post.");
              else togglePostForm();
            }}
            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:scale-105 transition"
          >
            Post Something
          </button>
        </section>

        {/* Search */}
        <div className="px-4 max-w-2xl mx-auto mb-4">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search posts..."
              className="bg-transparent outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Post Form */}
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

        {/* Posts Section */}
        <section className="px-4 max-w-2xl mx-auto grid gap-6 pb-12">
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Loading posts...</div>
          ) : loadError ? (
            <div className="text-center text-red-500">{loadError}</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">No matching posts.</div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post._id}
                className="transition transform hover:scale-[1.01] hover:shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-white dark:bg-gray-800"
              >
                <p className="text-lg mb-3">{post.content}</p>
                {getImageUrl(post) && (
                  <img src={getImageUrl(post)} alt="post" className="mb-3 rounded-lg" />
                )}
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Posted on {new Date(post.createdAt).toLocaleString()}
                </div>

                {/* Comments */}
                <div className="space-y-2">
                  {(post.comments || []).slice(0, 3).map((comment, i) => (
                    <div key={i} className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded">
                      {comment.content}
                    </div>
                  ))}
                  {post.comments?.length > 3 && (
                    <div className="text-xs text-gray-400 italic">...and {post.comments.length - 3} more</div>
                  )}
                </div>

                {/* Comment Form */}
                {(isLoggedIn &&
                  post.author !== currentUserId &&
                  post.author?._id !== currentUserId) && (
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
                )}
              </div>
            ))
          )}
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
