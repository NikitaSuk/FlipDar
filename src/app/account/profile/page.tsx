"use client";
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const UserIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">👤</span>;
const EditIcon = () => <span className="inline-block w-4 h-4">✏️</span>;
const SaveIcon = () => <span className="inline-block w-4 h-4">💾</span>;
const CancelIcon = () => <span className="inline-block w-4 h-4">❌</span>;

export default function ProfilePage() {
  const session = useSession();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    displayName: session?.user?.user_metadata?.full_name || '',
    bio: 'Passionate flipper and reseller. Always looking for the next great deal!',
    location: 'United States',
    website: '',
    phone: '',
    avatar: session?.user?.user_metadata?.avatar_url || ''
  });
  const [tempProfile, setTempProfile] = useState(profile);

  useEffect(() => {
    if (session === undefined) return;
    if (session === null) {
      router.push('/');
    }
    setChecked(true);
  }, [session, router]);

  useEffect(() => {
    if (session?.user) {
      const newProfile = {
        displayName: session.user.user_metadata?.full_name || '',
        bio: 'Passionate flipper and reseller. Always looking for the next great deal!',
        location: 'United States',
        website: '',
        phone: '',
        avatar: session.user.user_metadata?.avatar_url || ''
      };
      setProfile(newProfile);
      setTempProfile(newProfile);
    }
  }, [session]);

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setProfile(tempProfile);
    setIsEditing(false);
    // Here you would save to the database
    console.log('Saving profile:', tempProfile);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  if (session === undefined || !checked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl mt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/account" className="text-gray-600 hover:text-gray-800 mr-4">← Back to Account</Link>
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          </div>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <EditIcon />
              <span className="ml-2">Edit Profile</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <SaveIcon />
                <span className="ml-2">Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                <CancelIcon />
                <span className="ml-2">Cancel</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  session.user.email?.[0]?.toUpperCase()
                )}
              </div>
              {isEditing && (
                <button className="mt-2 w-full text-sm text-green-600 hover:text-green-700">
                  Change Photo
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-gray-800">
                      {profile.displayName || 'No display name set'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="text-gray-600">{session.user.email}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={tempProfile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="text-gray-600">{profile.bio}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempProfile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <div className="text-gray-600">{profile.location}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              {isEditing ? (
                <input
                  type="url"
                  value={tempProfile.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <div className="text-gray-600">
                  {profile.website ? (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">
                      {profile.website}
                    </a>
                  ) : (
                    'No website set'
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={tempProfile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <div className="text-gray-600">{profile.phone || 'No phone number set'}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <div className="text-gray-600">
                {session.user.created_at ? new Date(session.user.created_at).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Total Searches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$0</div>
              <div className="text-sm text-gray-600">Total Profit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Days Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 