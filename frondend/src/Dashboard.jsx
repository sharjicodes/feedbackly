import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [receivedComments, setReceivedComments] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDashboardData = async () => {
  try {
    const [postsRes, receivedRes, madeRes] = await Promise.all([
      axios.get('/api/posts/mine', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('/api/comments/mine/on-my-posts', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('/api/comments/mine/my-comments', { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    setMyPosts(postsRes.data);
    setReceivedComments(receivedRes.data);
    setMyComments(madeRes.data);
  } catch (err) {
    console.error('Error fetching dashboard data', err);
  } finally {
    setLoading(false);
  }
};


    fetchDashboardData();
  }, [token]);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          ← Return to Home
        </Link>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">📌 Your Posts</h2>
        {myPosts.length === 0 ? (
          <p className="text-gray-500">You haven't posted anything yet.</p>
        ) : (
          myPosts.map(post => (
            <div key={post._id} className="p-4 mb-3 bg-gray-100 rounded">
              <p>{post.content}</p>
              {post.image && <img src={post.image} alt="" className="mt-2 w-40" />}
            </div>
          ))
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">💬 Comments Received</h2>
        {receivedComments.length === 0 ? (
          <p className="text-gray-500">No one has commented on your posts yet.</p>
        ) : (
          receivedComments.map(c => (
            <div key={c._id} className="p-3 mb-2 bg-green-100 rounded">
              <p><strong>On your post:</strong> {c.post?.content}</p>
              <p className="italic">"{c.content}"</p>
            </div>
          ))
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">🗣️ Comments You Made</h2>
        {myComments.length === 0 ? (
          <p className="text-gray-500">You haven't commented on any posts yet.</p>
        ) : (
          myComments.map(c => (
            <div key={c._id} className="p-3 mb-2 bg-blue-100 rounded">
              <p><strong>On someone else's post:</strong> {c.post?.content}</p>
              <p className="italic">"{c.content}"</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Dashboard;
