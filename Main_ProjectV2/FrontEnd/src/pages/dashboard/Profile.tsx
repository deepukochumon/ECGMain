import { ProfileCard } from '../../components/profile/ProfileCard';

export function Profile() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Profile Settings
      </h1>
      <ProfileCard />
    </div>
  );
}