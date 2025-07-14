"use client";
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';

const SuggestionIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">💡</span>;
const LightbulbIcon = () => <span className="inline-block w-6 h-6 mr-3">💡</span>;
const BugIcon = () => <span className="inline-block w-6 h-6 mr-3">🐛</span>;
const FeatureIcon = () => <span className="inline-block w-6 h-6 mr-3">✨</span>;
const GeneralIcon = () => <span className="inline-block w-6 h-6 mr-3">📝</span>;

type SuggestionType = 'feature' | 'bug' | 'improvement' | 'general';

interface Suggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'reviewing' | 'planned' | 'completed' | 'declined';
  createdAt: string;
  userEmail?: string;
}

export default function SuggestionsPage() {
  const { session, isLoading } = useProtectedRoute();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'feature' as SuggestionType,
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!session?.user?.id) return;
    setLoading(true);
    fetch(`/api/suggestions?userId=${session.user.id}`)
      .then(res => res.json())
      .then(data => setSuggestions(data.suggestions || []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  }, [session]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          userId: session.user.id,
          ...formData
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit suggestion');
      }

      setSuccess('Suggestion submitted successfully!');
      setFormData({
        type: 'feature',
        title: '',
        description: '',
        priority: 'medium'
      });
      setShowForm(false);
      
      // Refresh suggestions list
      const refreshRes = await fetch(`/api/suggestions?userId=${session.user.id}`);
      const refreshData = await refreshRes.json();
      setSuggestions(refreshData.suggestions || []);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit suggestion');
    } finally {
      setSubmitting(false);
    }
  };

  const getTypeIcon = (type: SuggestionType) => {
    switch (type) {
      case 'feature': return <FeatureIcon />;
      case 'bug': return <BugIcon />;
      case 'improvement': return <LightbulbIcon />;
      default: return <GeneralIcon />;
    }
  };

  const getTypeLabel = (type: SuggestionType) => {
    switch (type) {
      case 'feature': return 'New Feature';
      case 'bug': return 'Bug Report';
      case 'improvement': return 'Improvement';
      default: return 'General';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'planned': return 'bg-blue-100 text-blue-700';
      case 'reviewing': return 'bg-purple-100 text-purple-700';
      case 'declined': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading suggestions...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // This will be handled by useProtectedRoute
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-6xl mt-8">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute left-0 top-0">
            <Link href="/account" className="text-gray-600 hover:text-gray-800">← Back to Account</Link>
          </div>
          <div className="absolute right-0 top-0">
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              + Submit Suggestion
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center">
              <SuggestionIcon />
              Suggestions & Feedback
            </h1>
          </div>
        </div>

        {/* Winner Announcement Bubble */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="inline-block w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                🏆
              </span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-purple-800 mb-1">
                Monthly Suggestion Contest
              </h3>
              <p className="text-sm text-purple-700">
                Submit quality suggestions for a chance to win! The more detailed and well-thought-out your suggestions are, the higher your chances of being selected as our monthly winner. Winners receive exclusive perks and recognition.
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Submit Suggestion Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl" 
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-6">Submit a Suggestion</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as SuggestionType })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="feature">New Feature</option>
                      <option value="bug">Bug Report</option>
                      <option value="improvement">Improvement</option>
                      <option value="general">General Feedback</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Brief title for your suggestion"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={6}
                    placeholder="Please provide detailed description of your suggestion, including any relevant context, use cases, or examples..."
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex-1"
                  >
                    {submitting ? 'Submitting...' : 'Submit Suggestion'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Suggestions List */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Your Suggestions</h2>
            <div className="text-sm text-gray-500">
              {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your suggestions...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-2">💡</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Suggestions Yet</h3>
              <p className="text-gray-600 mb-4">
                Be the first to share your ideas! Your feedback helps us improve FlipDar.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                Submit Your First Suggestion
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      {getTypeIcon(suggestion.type)}
                      <div>
                        <h3 className="font-semibold text-gray-800">{suggestion.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">{getTypeLabel(suggestion.type)}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                            {suggestion.priority}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(suggestion.status)}`}>
                            {suggestion.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(suggestion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How Suggestions Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📝</div>
              <h4 className="font-medium text-gray-800 mb-2">Submit</h4>
              <p className="text-sm text-gray-600">
                Share your ideas for new features, report bugs, or suggest improvements
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">👀</div>
              <h4 className="font-medium text-gray-800 mb-2">Review</h4>
              <p className="text-sm text-gray-600">
                Our team reviews all suggestions and provides status updates
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🚀</div>
              <h4 className="font-medium text-gray-800 mb-2">Implement</h4>
              <p className="text-sm text-gray-600">
                Top suggestions get prioritized and implemented in future updates
              </p>
            </div>
          </div>
        </div>

        {/* Related Topics */}
        <div className="mt-6 bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Link href="/contact" className="block text-green-600 hover:text-green-700 font-medium">
                📧 Contact Support →
              </Link>
              <Link href="/faq" className="block text-green-600 hover:text-green-700 font-medium">
                ❓ FAQ & Help Center →
              </Link>
            </div>
            <div className="space-y-3">
              <Link href="/account/subscription" className="block text-green-600 hover:text-green-700 font-medium">
                💳 Subscription Plans →
              </Link>
              <Link href="/account/settings" className="block text-green-600 hover:text-green-700 font-medium">
                ⚙️ Account Settings →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 