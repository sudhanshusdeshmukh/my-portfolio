const ProfileSelect = ({ profiles, onSelect }) => {
  return (
    <div className="netflix-profile-screen">
      <header className="profile-header">
        <img src="https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png" alt="Netflix logo" className="profile-logo" />
      </header>
      <main className="profile-main">
        <h1 className="profile-title">Who&apos;s watching?</h1>
        <div className="profile-grid">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              className="profile-card"
              style={{ '--accent-color': profile.accent }}
              onClick={() => onSelect(profile)}
            >
              <div className="profile-avatar">
                <img src={profile.artwork} alt={`${profile.name} avatar`} />
              </div>
              <span className="profile-name">{profile.name}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProfileSelect;
