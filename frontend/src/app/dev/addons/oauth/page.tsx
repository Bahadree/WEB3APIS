'use client';
import React, { useState } from 'react';

const ALL_SCOPES: { key: string; label: string }[] = [
  { key: 'email', label: 'E-posta adresi' },
  { key: 'username', label: 'Kullanıcı adı' },
  { key: 'avatar', label: 'Profil fotoğrafı' },
  { key: 'wallet', label: 'Cüzdan adresi' },
  { key: 'level', label: 'Oyun seviyesi' },
];

export default function OAuthSettingsPage() {
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);

  const handleScopeChange = (scope: string) => {
    setSelectedScopes((prev: string[]) =>
      prev.includes(scope)
        ? prev.filter((s) => s !== scope)
        : [...prev, scope]
    );
  };

  const handleSave = () => {
    // Burada seçilen scope'lar backend'e kaydedilebilir
    alert('Seçilen bilgiler: ' + selectedScopes.join(', '));
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">OAuth Bilgi Talep Ayarları</h2>
      <p className="mb-4 text-gray-600">Oyununuzun OAuth ile hangi kullanıcı verilerini talep edeceğini seçin.</p>
      <div className="mb-6">
        {ALL_SCOPES.map(scope => (
          <label key={scope.key} className="block mb-2">
            <input
              type="checkbox"
              checked={selectedScopes.includes(scope.key)}
              onChange={() => handleScopeChange(scope.key)}
              className="mr-2"
            />
            {scope.label}
          </label>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Kaydet
      </button>
    </div>
  );
}
