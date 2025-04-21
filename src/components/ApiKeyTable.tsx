import { ApiKey } from '@/types/api-key';
import { Copy, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';

interface ApiKeyTableProps {
  apiKeys: ApiKey[];
  visibleKeyIds: Set<string>;
  onToggleVisibility: (id: string) => void;
  onCopyKey: (key: string) => void;
  onEdit: (key: ApiKey) => void;
  onDelete: (id: string) => void;
}

export function ApiKeyTable({
  apiKeys,
  visibleKeyIds,
  onToggleVisibility,
  onCopyKey,
  onEdit,
  onDelete,
}: ApiKeyTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-4 px-6 text-gray-400 font-medium">Name</th>
            <th className="py-4 px-6 text-gray-400 font-medium">Key</th>
            <th className="py-4 px-6 text-gray-400 font-medium">Type</th>
            <th className="py-4 px-6 text-gray-400 font-medium">Usage</th>
            <th className="py-4 px-6 text-gray-400 font-medium">Limits</th>
            <th className="py-4 px-6 text-gray-400 font-medium">Created</th>
            <th className="py-4 px-6 text-gray-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((key) => (
            <tr key={key.id} className="border-b border-gray-700">
              <td className="py-4 px-6">{key.name}</td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <code className="font-mono bg-[#1e2435] px-2 py-1 rounded">
                    {visibleKeyIds.has(key.id) ? key.key : '••••••••••••••••'}
                  </code>
                  <button
                    onClick={() => onToggleVisibility(key.id)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    {visibleKeyIds.has(key.id) ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => onCopyKey(key.key)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </td>
              <td className="py-4 px-6">
                <span className={`px-2 py-1 rounded text-sm ${
                  key.type === 'prod' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {key.type === 'prod' ? 'Production' : 'Development'}
                </span>
              </td>
              <td className="py-4 px-6">{key.usage}</td>
              <td className="py-4 px-6">{key.limits}</td>
              <td className="py-4 px-6">
                {new Date(key.created_at).toLocaleDateString()}
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(key)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(key.id)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 